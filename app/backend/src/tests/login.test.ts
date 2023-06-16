import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import SequelizeUsers from '../database/models/SequelizeUsers';

import {
  loginWithoutEmail,
  loginWithoutPassword,
  loginWithInvalidEmail,
  loginWithInvalidPassword,
  loginWithDataCorrect,
  loginWithIncorrectEmail,
  loginWithIncorrectPassword,
} from './mocks/login.mocks';

import * as bcrypt from 'bcryptjs';

chai.use(chaiHttp);

const { expect } = chai;

describe('testing route /login', () => {
  it('should return status 200 and token on success', async () => {
    const { password, email } = loginWithDataCorrect;
    sinon.stub(SequelizeUsers, 'findOne').resolves(loginWithDataCorrect as SequelizeUsers);
    sinon.stub(bcrypt, 'compare').resolves(password);
    
    const { status } = await chai.request(app).post('/login').send({
      email: email,
      password: password,
    });

    expect(status).to.be.equal(200);
  });
  it('should return status 400 when trying to login without password', async () => {
    const { status } = await chai.request(app).post('/login').send(loginWithoutPassword);
    expect(status).to.be.equal(400);
  });
  it('should return status 400 when trying to login without email', async () => {
    const { status } = await chai.request(app).post('/login').send(loginWithoutEmail);
    expect(status).to.be.equal(400);
  });
  it('should return status 401 when trying to login with invalid password', async () => {
    const { status } = await chai.request(app).post('/login').send(loginWithInvalidPassword);
    expect(status).to.be.equal(401);
  });
  it('should return status 401 when trying to login with invalid email', async () => {
    const { status } = await chai.request(app).post('/login').send(loginWithInvalidEmail);
    expect(status).to.be.equal(401);
    sinon.restore();
  });
  it('should return status 401 when trying to login with incorrect email', async () => {
    sinon.stub(SequelizeUsers, 'findOne').resolves();
    sinon.stub(bcrypt, 'compare').resolves();
    const { status } = await chai.request(app).post('/login').send(loginWithIncorrectEmail);
    expect(status).to.be.equal(401);
    // sinon.restore();
  });
  // it('should return status 401 when trying to login with incorrect password', async () => {
  //   sinon.stub(SequelizeUsers, 'findOne').resolves(loginWithDataCorrect as SequelizeUsers);
  //   sinon.stub(bcrypt, 'compare').resolves(loginWithIncorrectPassword.password);
  //   const { status } = await chai.request(app).post('/login').send(loginWithIncorrectPassword);
  //   expect(status).to.be.equal(401);
  // });
});
