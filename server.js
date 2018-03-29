const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT;
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  pingTimeout: 30000,
  pingInterval: 30000
});

var mongojs = require('mongojs');
var db = mongojs('mongodb://username:password@ds113849.mlab.com:13849/chatapp');

server.listen(port, () => { console.log(`listening on port ${port}`)});
 // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// connection
io.on('connection', function(socket) {  
  socket.on('userJoined', (userId) => onUserJoined(socket));
  socket.on('message', (message) => onMessageReceived(message, socket, false));
}) 
 
function onUserJoined(socket){
  console.log('user joined', socket.id);
  socket.emit('userJoined', socket.id);
  sendExistingMessages(socket);
}

function sendExistingMessages(socket) {
  console.info('send existing message');
  var messages = db.collection('messages')
    .find({ })
    .sort({ createdAt: 1 })
    .toArray((err, messages) => {
      console.info('messages', messages);
      // If there aren't any messages, then return.
      if (!messages.length) return;
      socket.emit('message', messages.reverse());
  });
}

function onMessageReceived(message, senderSocket, fromServer) {
  console.info('on message received');
  var messageData = {
    text: message.text,
    user: message.user,
    createdAt: new Date(message.createdAt),
  };

  db.collection('messages').insert(messageData, (err, message) => {
    // If the message is from the server, then send to everyone.
    var emitter = fromServer ? websocket : senderSocket.broadcast;
    emitter.emit('message', [message]);
  });

}

// const initializeDatabases = require('./dbs')
// const routes = require('./routes')
// initializeDatabases().then(dbs => {
//   // Initialize the application once database connections are ready.
//   routes(app, dbs); 
//   server.listen(3000, () => console.log('Listening on port 3000'))
// }).catch(err => {
//   console.error('Failed to make all database connections!')
//   console.error(err)
//   process.exit(1)
// });
