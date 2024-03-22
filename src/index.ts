import * as express from 'express';
import {createServer} from "node:http"
import {Server} from "socket.io"
import * as dotenv from 'dotenv'

dotenv.config({
  path: [__dirname + '/.env', __dirname + '/.env.local']
})

dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

const {WEBHOOK_SECRET} = process.env
if (!WEBHOOK_SECRET) {
  console.error('Missing webhook secret')
  process.exit(1)
}

app.post('/webhook', (req, res) => {
  const password = req.get('x-webhook-secret')
  if (password !== WEBHOOK_SECRET) {
    res.send('Password incorrect')
    return
  }
  io.emit('link', 'The links have been updated');
  res.send('Links updated');
})

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
