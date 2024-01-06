import app from '../../server.js';
import supertest from 'supertest';
import chaiHttp from 'chai-http';
import * as chai from 'chai';

const request = supertest(app);
const { expect } = chai
chai.use(chaiHttp);



describe('Integration Test for Auth Routes', () => {

    //signup test
    it('should sign up a new user', async () => {
        const userCredentials = {
            name: 'khan',
            email: 'khan@example.com',
            password: 'password123',
        };

        const res = await request
            .post('/api/auth/signup')
            .send(userCredentials);

        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('name', userCredentials.name);
        expect(res.body).to.have.property('email', userCredentials.email);
    });


    //login test
    it('should successfully log in a user and return a token', async () => {
        const testUser = {
            name: 'Mike',
            email: 'mike@example.com',
            password: 'password123',
        };

        const signupResponse = await request
            .post('/api/auth/signup')
            .send(testUser);


        const loginResponse = await request
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password,
            });

        expect(loginResponse.body).to.have.property('_id');
        expect(loginResponse.body).to.have.property('name', testUser.name);
        expect(loginResponse.body).to.have.property('email', testUser.email);
        expect(loginResponse.body).to.have.property('token');
    })

})
