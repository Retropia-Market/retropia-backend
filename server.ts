require('dotenv').config();
import * as http from 'http';

const WS = require('./ws');
const { app } = require('./src/app');
const { PORT } = process.env;

const server = http.createServer(app);
// WS.init(server);
server.listen(PORT, () => console.log('server listening on port: ', PORT));

module.exports = { server };
