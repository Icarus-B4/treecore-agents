import { WebSocket } from 'ws'

const PORT = process.env.TEST_PORT || 8789
const ws = new WebSocket(`ws://127.0.0.1:${PORT}/api/ws`)
const log = []
ws.on('message', m => {
  const f = JSON.parse(m.toString())
  if (f.method === 'event') {
    log.push(`${f.params.type}:${JSON.stringify(f.params).slice(0, 80)}`)
  } else if (f.id !== undefined) {
    log.push(`RESPONSE:${JSON.stringify(f.result || f.error).slice(0, 80)}`)
  }
})
ws.on('open', async () => {
  const send = (method, params) => new Promise(res => {
    const id = Math.random()
    ws.send(JSON.stringify({ jsonrpc: '2.0', id, method, params }))
    ws.once('message', r => res(JSON.parse(r.toString())))
  })
  console.log('--- /write ---')
  const r1 = await send('prompt.submit', { session_id: 't1', text: '/write D:/local/hermes/apps/gateway/test-out.txt hello-world' })
  console.log('RESP r1:', JSON.stringify(r1).slice(0, 100))
  console.log('--- /read ---')
  const r2 = await send('prompt.submit', { session_id: 't1', text: '/read D:/local/hermes/apps/gateway/test-out.txt' })
  console.log('RESP r2:', JSON.stringify(r2).slice(0, 100))
  console.log('EVENTS:', log.join('\n  '))
  ws.close()
  process.exit(0)
})
setTimeout(() => { console.log('TIMEOUT', log.join('\n  ')); process.exit(1) }, 12000)
