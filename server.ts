require('dotenv').config();
const http = require('http');

const WS = require('./ws');
const { app } = require('./src/app');
const { PORT } = process.env;

const server = http.createServer(app);
WS.init(server);
server.listen(PORT, () => console.log('server listening on port: ', PORT));

module.exports = { server };
