import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');

const jwtPayload = {
  email: 'admin@admin.com',
  role: 'admin'
}

import { app } from '../app';
import SequelizeMatches from '../database/models/SequelizeMatches';

import { matchesMock, matchesInProgress } from './mocks/matches.mocks';

chai.use(chaiHttp);

const { expect } = chai;

describe('testing route /matches', () => {
  it('should return all matches', async () => {
    const { body } = await chai.request(app).get('/matches');
    expect(body).to.deep.equal(matchesMock);
  });
  it('should return matches in progress', async () => {
    const { body } = await chai.request(app).get('/matches?inProgress=true');
    expect(body).to.deep.equal(matchesInProgress);
  });
});
describe('testing router PATCH /matches/:id/finish', () => {
  it('should return status 200 and a message', async () => {
    sinon.stub(jwt, 'verify').callsFake(() => jwtPayload);
    sinon.stub(SequelizeMatches, 'findOne').resolves(matchesMock[1] as unknown as SequelizeMatches);
    sinon.stub(SequelizeMatches, 'update').resolves([1]);

    const response = await chai.request(app).patch('/matches/41/finish')
      .set('Authorization', 'token');

    expect(response.body).to.be.deep.equal({ message: 'Finished' });
  });
});
