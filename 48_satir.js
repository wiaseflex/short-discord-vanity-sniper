const fs = require('fs'), http2 = require('http2'), WebSocket = require('./ws/websocket')
const client = http2.connect('https://canary.discord.com')

const token = ""
const guilds = {}
let mfa = null

function connect() {
  const ws = new WebSocket("wss://gateway.discord.gg");

  ws.on('open', () => {
    ws.send(JSON.stringify({ op: 2, d: { token, intents: 1, properties: { os: 'Linux', browser: 'Firefox' }}}));
  });

  ws.on('message', raw => { const { t, op, d } = JSON.parse(raw) || {};

    if (t === 'GUILD_UPDATE' && guilds[d.id] !== d.vanity_url_code) {
        const body = `{"code":"${guilds[d.id]}"}`
        client.request({":method":"PATCH",":path":"/api/v6/guilds/1420089029441093796/vanity-url","content-length":Buffer.byteLength(body),"authorization":token,"x-discord-mfa-authorization":mfa,"user-agent":"Mozilla/5.0","content-type":"application/json","x-super-properties":"eyJicm93c2VyIjoiRmlyZWZveCIsImJyb3dzZXJfdXNlcl9hZ2VudCI6IkZpcmVmb3gifQ=="}).end(body)
        client.request({":method":"PATCH",":path":"/api/v7/guilds/1420089029441093796/vanity-url","content-length":Buffer.byteLength(body),"authorization":token,"x-discord-mfa-authorization":mfa,"user-agent":"Mozilla/5.0","content-type":"application/json","x-super-properties":"eyJicm93c2VyIjoiRmlyZWZveCIsImJyb3dzZXJfdXNlcl9hZ2VudCI6IkZpcmVmb3gifQ=="}).end(body)
        client.request({":method":"PATCH",":path":"/api/v9/guilds/1420089029441093796/vanity-url","content-length":Buffer.byteLength(body),"authorization":token,"x-discord-mfa-authorization":mfa,"user-agent":"Mozilla/5.0","content-type":"application/json","x-super-properties":"eyJicm93c2VyIjoiRmlyZWZveCIsImJyb3dzZXJfdXNlcl9hZ2VudCI6IkZpcmVmb3gifQ=="}).end(body)
    }

    if (t === 'READY') {d.guilds.forEach(g => {if (g.vanity_url_code) {guilds[g.id] = g.vanity_url_code}})}
    if (op === 10) setInterval(() => ws.send('{"op":1,"d":null}'), d.heartbeat_interval)
    if (op === 7) process.exit()
  });
}

setInterval(() => {
  if (client.destroyed) process.exit();
  const req = client.request({
    ':method': 'HEAD',
    ':path': '/api/users/@me',
    'authorization': token,
  });
  req.on('error', () => {});
  req.end();
}, 2000);

function watcher() {
  const update = () => mfa = fs.readFileSync("mfa.txt").toString().trim()
  update()
  fs.watchFile("mfa.txt", { interval: 3000 }, update)
}

watcher()
connect()
