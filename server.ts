require('dotenv').config();
import * as http from 'http';

import * as ws from './src/ws';
const { app } = require('./src/app');
const { PORT } = process.env;

const server = http.createServer(app);
ws.init(server);
server.listen(PORT, () => console.log('server listening on port: ', PORT));

module.exports = { server };
