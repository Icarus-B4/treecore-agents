import { WebSocket } from 'ws'

const ws = new WebSocket('ws://127.0.0.1:8789/api/ws')
let id = 1
const pending = new Map()

ws.on('open', () => {
  // 1) model.options
  ws.send(JSON.stringify({ jsonrpc: '2.0', id: id++, method: 'model.options', params: {} }))
  // 2) prompt.submit (LLM stream) -- will fail if no LLM at :11434, but exercises the path
  setTimeout(() => {
    ws.send(JSON.stringify({ jsonrpc: '2.0', id: id++, method: 'prompt.submit', params: { session_id: 'test', text: 'hello' } }))
  }, 200)
})

ws.on('message', (m) => {
  const f = JSON.parse(m.toString())
  if (f.method === 'event') {
    console.log('EVENT:', f.params.type, JSON.stringify(f.params).slice(0, 120))
    return
  }
  console.log('RPC-RESP:', JSON.stringify(f).slice(0, 200))
  if (f.id && f.id >= 2) { ws.close(); process.exit(0) }
})

ws.on('error', (e) => { console.log('WS ERR', e.message); process.exit(1) })
setTimeout(() => { console.log('timeout'); process.exit(1) }, 6000)
