const request = require('supertest');
const app = require('../index');

describe('User Routes', () => {
    let cookie; // store the authentication cookie for logged-in user

    const userData = {
        name: 'example',
        email: 'examc@gmail.com',
        password: 'ezedlbc123'
    };

    it('should sign up a new user', async () => {
        const res = await request(app)
            .post('/user')
            .send(userData)
            .expect(302); 
        expect(res.header['location']).toBe('/login');
    });

    it('should log in existing user', async () => {
        const res = await request(app)
            .post('/user/login')
            .send({ email: userData.email, password: userData.password })
            .expect(302);
        expect(res.header['location']).toBe('/');
        cookie = res.headers['set-cookie'][0];
    });

    it('should access restricted route after login', async () => {
        await request(app)
            .get('/') 
            .set('Cookie', cookie) 
            .expect(200); 
    });

    it('should fail to access restricted route without login', async () => {
        await request(app)
            .get('/') 
            .expect(302); 
    });

    it('should redirect to login page when accessing restricted route without login', async () => {
        await request(app)
            .get('/url') 
            .expect(302) 
            .expect('Location', '/login');
    });

    it('should create a new short URL', async () => {
        const urlData = {
            url: 'https://google.com'
        };

        const res = await request(app)
            .post('/url')
            .set('Cookie', cookie)
            .send(urlData)
            .expect(200); 
    });
});
