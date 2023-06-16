import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

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
