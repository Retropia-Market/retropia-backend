const supertest = require('supertest');
const { app, server } = require('../server');

const api = supertest(app);

test('Catalogo se devuelve en json', async () => {
    await api
        .get('/catalogue')
        .expect(200)
        .expect('Content-Type', /application\/json/);
});

afterAll(() => {
    server.close();
});
