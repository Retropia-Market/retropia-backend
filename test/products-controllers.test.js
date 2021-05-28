const supertest = require('supertest');
const { server } = require('../server');
const { app } = require('../app');

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
