// const http = require('http');
// const ws = require('ws');

const { app } = require('./app');
const { PORT } = process.env;

// const server = http.createServer(app);

const server = app.listen(PORT, () =>
    console.log(`Servidor escuchando en: ${PORT}`)
);

module.exports = { server };
