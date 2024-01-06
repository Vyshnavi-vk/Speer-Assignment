import * as chai from 'chai'
import Users from '../../models/userModel.js';
import { signup, login } from '../../controllers/userController.js'
import sinonChai from 'sinon-chai';
import bcrypt from 'bcrypt'
import { expect } from 'chai';
import sinon from 'sinon';
import app from '../../server.js'


chai.use(sinonChai)


describe('Auth Controller', () => {
    afterEach(() => {
        sinon.restore();
    });


    //singup
    it('should create a new user on signup', async () => {
        const req = { body: { name: 'test', email: 'test@gmail.com', password: '123456' } };
        const res = { status: sinon.stub(), json: sinon.stub() };

        sinon.stub(Users, 'create').resolves({
            _id: 'test123',
            name: req.body.name,
            email: req.body.email,
        });

        await signup(req, res);

        expect(res.json).to.have.been.calledWithMatch({
            id: 'test123',
            name: req.body.name,
            email: req.body.email,
        });
    });


    //login
    it('should return an access token on login', async () => {
        const req = { body: { email: 'test@gmail.com', password: '123456' } };
        const res = { status: sinon.stub(), json: sinon.stub() };

        const fakeUser = { _id: 'test123', name: 'test', email: 'test@gmail.com', password: 'hashedPassword' };
        sinon.stub(Users, 'findOne').resolves(fakeUser);

        const fakeComparePassword = sinon.stub(bcrypt, 'compare').resolves(true);

        await login(req, res);

        expect(res.json).to.have.been.calledWithMatch({ _id: 'test123', name: 'test', email: 'test@gmail.com', token: sinon.match.string });
    });


});










