// Hermes Local Gateway — minimal standalone backend for the copied Hermes
// Desktop app. Speaks the @hermes/shared JSON-RPC-over-WS protocol + the REST
// surface the renderer hits (window.hermesDesktop.api). NO Nous backend.
//
// What it does today (proven minimal core):
//   - WS JSON-RPC: session.info, prompt.submit, llm.oneshot, model.options,
//     commands.catalog, session.title, message.react
//   - REST:        /api/status, /api/sessions, /api/profiles/sessions/sidebar
//   - prompt.submit -> calls a configurable LLM (OpenAI-compatible) and streams
//     message.delta events back; also runs a `shell` tool (local command).
//
// Config (env or gateway.env next to this file):
//   LLM_BASE_URL   default http://localhost:11434/v1   (Ollama)
//   LLM_API_KEY    default (empty — local models need none)
//   LLM_MODEL      default llama3.1
//   PORT           default 8789
//   WS_PATH        default /api/ws
//
// This is the START of a local backend, not a full Hermes replacement.

import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { WebSocketServer } from 'ws'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.join(__dirname, 'gateway.env')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/)
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2]
  }
}

const LLM_BASE_URL = process.env.LLM_BASE_URL || 'http://localhost:11434/v1'
const LLM_API_KEY = process.env.LLM_API_KEY || ''
const LLM_MODEL = process.env.LLM_MODEL || 'llama3.1'
const PORT = Number(process.env.PORT || 8789)
const WS_PATH = process.env.WS_PATH || '/api/ws'

// In-memory session store (no persistence — local only).
const sessions = new Map()
function ensureSession(id) {
  if (!sessions.has(id)) {
    sessions.set(id, { id, title: 'New session', messages: [], running: false })
  }
  return sessions.get(id)
}

// ---- LLM bridge (OpenAI-compatible /v1/chat/completions streaming) ----
async function* streamLlm(messages) {
  const body = JSON.stringify({ model: LLM_MODEL, messages, stream: true })
  const res = await fetch(`${LLM_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(LLM_API_KEY ? { Authorization: `Bearer ${LLM_API_KEY}` } : {})
    },
    body
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`LLM ${res.status}: ${txt.slice(0, 200)}`)
  }
  const reader = res.body.getReader()
  const dec = new TextDecoder()
  let buf = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buf += dec.decode(value, { stream: true })
    const lines = buf.split('\n')
    buf = lines.pop()
    for (const ln of lines) {
      const t = ln.trim()
      if (!t.startsWith('data:')) continue
      const data = t.slice(5).trim()
      if (data === '[DONE]') return
      try {
        const json = JSON.parse(data)
        const delta = json.choices?.[0]?.delta?.content
        if (delta) yield delta
      } catch {}
    }
  }
}

// ---- local shell tool ----
import { exec } from 'node:child_process'
function runShell(cmd, cwd = process.cwd()) {
  return new Promise((resolve) => {
    exec(cmd, { cwd, timeout: 30000 }, (err, stdout, stderr) => {
      resolve((err ? `error: ${err.message}\n` : '') + stdout + stderr)
    })
  })
}

// ---- RPC dispatch ----
const commands = [
  { name: 'help', description: 'List available commands' },
  { name: 'shell', description: 'Run a local shell command: /shell <cmd>' }
]

async function dispatch(method, params, ctx) {
  switch (method) {
    case 'session.info': {
      const s = ensureSession(params.session_id || 'default')
      return { id: s.id, title: s.title, running: s.running, message_count: s.messages.length }
    }
    case 'session.title': {
      const s = ensureSession(params.session_id || 'default')
      s.title = params.title || s.title
      return { ok: true }
    }
    case 'model.options': {
      return { models: [{ id: LLM_MODEL, name: LLM_MODEL, provider: 'local' }], default: LLM_MODEL }
    }
    case 'commands.catalog': {
      return { commands }
    }
    case 'message.react':
      return { ok: true }
    case 'llm.oneshot': {
      const out = []
      for await (const d of streamLlm([{ role: 'user', content: params.text || '' }])) out.push(d)
      return { text: out.join('') }
    }
    case 'prompt.submit': {
      const sid = params.session_id || 'default'
      const s = ensureSession(sid)
      s.running = true
      const text = params.text || ''
      ctx.event('message.start', { session_id: sid, role: 'user', text })
      s.messages.push({ role: 'user', content: text })
      // slash command: shell
      let reply = ''
      if (text.startsWith('/shell ')) {
        ctx.event('tool.start', { session_id: sid, name: 'shell', input: text.slice(7) })
        const out = await runShell(text.slice(7))
        ctx.event('tool.complete', { session_id: sid, name: 'shell', output: out })
        reply = out
      } else {
        try {
          for await (const d of streamLlm(s.messages)) {
            reply += d
            ctx.event('message.delta', { session_id: sid, delta: d })
          }
        } catch (e) {
          ctx.event('error', { session_id: sid, message: e.message })
        }
      }
      s.messages.push({ role: 'assistant', content: reply })
      s.running = false
      ctx.event('message.complete', { session_id: sid, text: reply })
      ctx.event('session.info', { id: sid, title: s.title, running: false, message_count: s.messages.length })
      return { ok: true, session_id: sid }
    }
    default:
      throw new Error(`unknown method: ${method}`)
  }
}

// ---- HTTP REST ----
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end() }

  if (url.pathname === '/api/status') {
    return res.end(JSON.stringify({ ok: true, auth_required: false, gateway: 'local', version: '0.1.0' }))
  }
  if (url.pathname === '/api/sessions') {
    const list = [...sessions.values()].map(s => ({ id: s.id, title: s.title, message_count: s.messages.length }))
    return res.end(JSON.stringify({ sessions: list, total: list.length }))
  }
  if (url.pathname === '/api/profiles/sessions/sidebar') {
    const list = [...sessions.values()].map(s => ({ id: s.id, title: s.title, last_message: s.messages.at(-1)?.content?.slice(0, 80) || '' }))
    return res.end(JSON.stringify({ sessions: list }))
  }
  res.statusCode = 404
  res.end(JSON.stringify({ error: 'not found', path: url.pathname }))
})

// ---- WS JSON-RPC ----
const wss = new WebSocketServer({ server, path: WS_PATH })
wss.on('connection', (ws) => {
  const event = (type, payload) => {
    if (ws.readyState === ws.OPEN) ws.send(JSON.stringify({ jsonrpc: '2.0', method: 'event', params: { type, ...payload } }))
  }
  const ctx = { event }
  ws.on('message', async (raw) => {
    let frame
    try { frame = JSON.parse(raw.toString()) } catch { return }
    const { id, method, params } = frame
    if (!method) return
    try {
      const result = await dispatch(method, params || {}, ctx)
      if (id !== undefined && id !== null) ws.send(JSON.stringify({ jsonrpc: '2.0', id, result }))
    } catch (e) {
      if (id !== undefined && id !== null) ws.send(JSON.stringify({ jsonrpc: '2.0', id, error: { message: e.message } }))
    }
  })
  event('gateway.ready', { gateway: 'local' })
})

server.listen(PORT, () => {
  console.log(`[hermes-local-gateway] listening on http://localhost:${PORT} (ws ${WS_PATH}), LLM=${LLM_MODEL} @ ${LLM_BASE_URL}`)
})
