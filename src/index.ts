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
const io = new Server(server)

const {WEBHOOK_SECRET} = process.env
if (!WEBHOOK_SECRET) {
  console.error('Missing webhook secret')
  process.exit(1)
}

app.post('/webhook', (req, res) => {
  const password = req.get('x-webhook-secret')
  if (password !== WEBHOOK_SECRET) {
    res.sendStatus(403)
    return
  }
  io.emit('link', 'The links have been updated');
  res.send('Links updated');
})

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});

/*
app.get('/', (req, res) => {
  res.send(`<doctype HTML>
  <html>
    <head>
      <title>My first express app</title>
    </head>
    <body>
    <ul id="messages"></ul>
    <form id="form" action="">
      <input name="message" autocomplete="off" /><button>Send</button>
    </form>
    <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
    <script>
    const form = document.querySelector('form')
    const messages = document.getElementById('messages');
    
    const socket = io()

    socket.on('chat message', (msg) => {
      const item = document.createElement('li');
      item.textContent = msg;
      messages.appendChild(item);
      window.scrollTo(0, document.body.scrollHeight);
    });


    const handleSubmit = (e) => {
      e.preventDefault()
      const formdata = new FormData(e.target)
      const message = formdata.get('message')
      if (!message) return
      socket.emit('chat message', message)
      e.target.reset()
    }
    form.addEventListener('submit', handleSubmit)
    </script>
  </body>
  </html>
`);
});
*/
