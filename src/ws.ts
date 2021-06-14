import jwt from 'jsonwebtoken';
import ws from 'ws';

import { chatRepository } from './repositories';
import { findUserById } from './repositories/users-repository';
const secret = process.env.JWT_SECRET;

// State
let wss;
const clients = new Map();

// Actions
const send = (message) => {
  const dst_id = clients.get(message.dst_id) || [];
  const src_id = clients.get(message.src_id) || [];
  const sockets = [...src_id, ...dst_id];
  const text = JSON.stringify(message);
  console.log(src_id, dst_id, sockets.length);
  console.log(Array.from(clients.keys()));
  sockets.forEach((c) => c.send(text));
};

const init = (server) => {
  wss = new ws.Server({ server, path: '/ws' });
  wss.on('connection', (socket) => {
    socket.on('message', async (e) => {
      const data = JSON.parse(e);
      if (!socket.auth) {
        try {
          const uid = parseInt(jwt.verify(data?.auth, secret).id);
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
          const targetUser: any = await findUserById(data.target);
          if (!targetUser || data.target === socket.auth.uid) {
            socket.send(
              JSON.stringify({
                error: 'Chat no encontrado',
              })
            );
            return;
          }
          const message = await chatRepository.addMessage(
            data.message,
            socket.auth.uid,
            data.target
          );
          console.log(message);
          send(message);
        }
      }
    });
    socket.on('close', () => {
      console.log('client disconnected');
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

export { init, send };
