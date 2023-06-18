import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { leaderboardHome } from './mocks/leaderboard.mocks';

chai.use(chaiHttp);

const { expect } = chai;

describe('testing route /leaderboard/home', () => {
  it('should return all teams on leaderboard', async () => {
    const { body } = await chai.request(app).get('/leaderboard/home');
    expect(body).to.deep.equal(leaderboardHome);
  })
});
