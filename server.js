const { app } = require('./app');

const { PORT } = process.env;

const server = app.listen(PORT, () =>
    console.log(`Servidor escuchando en: ${PORT}`)
);

module.exports = { server };
