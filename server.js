require('dotenv').config();
const http = require('http');

const ws = require('./ws');
const { app } = require('./app');
const { PORT } = process.env;

const server = http.createServer(app);
ws.init(server);
server.listen(PORT, () => console.log('server listening on port: ', PORT));

module.exports = { server };
