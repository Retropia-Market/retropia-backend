const jwt = require('jsonwebtoken');
const ws = require('ws');
const { chatController } = require('./controllers');
const secret = process.env.JWT_SECRET;

// State
let wss;
const clients = new Map();

// Actions
const send = (message) => {
  const dst = clients.get(message.dst) || [];
  const src = clients.get(message.src) || [];
  const sockets = [...src, ...dst];
  const text = JSON.stringify(message);
  sockets.forEach((c) => c.send(text));
};

const init = (server) => {
  wss = new ws.Server({ server, path: '/ws' });
  wss.on('connection', (socket) => {
    socket.on('message', async (e) => {
      const data = JSON.parse(e);
      if (!socket.auth) {
        try {
          const uid = parseInt(jwt.verify(data?.auth, secret));
          socket.auth = { uid };
          if (!clients.get(uid)) clients.set(uid, []);
          clients.get(uid).push(socket);
        } catch (e) {
          socket.send(JSON.stringify({ error: 'Auth required' }));
        }
      } else {
        if (!data.message || !data.target) {
          socket.send(
            JSON.stringify({
              error: 'Falta algún campo obligatorio: message, target',
            })
          );
        } else {
          const targetUser = await chatController.getContacts(data.target);
          if (!targetUser || data.target === socket.auth.uid) {
            socket.send(
              JSON.stringify({
                error: 'Chat no encontrado',
              })
            );
            return;
          }
          const message = await chatController.addMessage(
            data.message,
            socket.auth.uid,
            data.target
          );
          send(message);
        }
      }
    });
    socket.on('close', () => {
      const uid = socket.auth?.uid;
      if (uid) {
        clients.set(
          uid,
          clients.get(uid).filter((s) => s !== socket)
        );
      }
    });
  });
};

exports = module.exports = {
  init,
  send,
};
