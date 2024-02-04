const { WebSocketServer } = require('ws');
const dotenv = require('dotenv');

dotenv.config()


const wss = new WebSocketServer({ port: process.env.PORT || 8080 })

const clients = []

wss.on('connection', (ws) => {
  ws.on('error', console.error)

  clients.push(ws)


  ws.on('message', (data) => {
    const message = JSON.parse(data)
    // Itera sobre todos os clientes conectados
    wss.clients.forEach(client => {

      if (message.type === 'login' && client !== ws) {

        console.log(`${message.userName} acabou de logar...`)
    
          client.send(data.toString());
        

       }else if (message.type === 'message') {

        console.log(`o user ${message.userName} enviou ${message.content}`)
        client.send(data.toString());

      } else if (message.type === 'logout') {

        console.log(`${message.userName} acabou de deslogar...`)
        client.send(data.toString());

      }
    });
  });

  console.log('Client connected')
})