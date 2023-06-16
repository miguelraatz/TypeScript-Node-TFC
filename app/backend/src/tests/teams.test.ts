import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import SequelizeTeams from '../database/models/SequelizeTeams';

import { teamsMock, teamIdMock } from './mocks/teams.mocks';

chai.use(chaiHttp);

const { expect } = chai;

describe('testing route /teams', () => {
  it('should return all teams', async () => {
    const { body } = await chai.request(app).get('/teams');
    expect(body).to.deep.equal(teamsMock);
  });
  it('should return team by id', async () => {
    const { body } = await chai.request(app).get('/teams/3');
    expect(body).to.deep.equal(teamIdMock);
  });
  it('should return status 404 with team not found', async () => {
    const { status } = await chai.request(app).get('/teams/17');
    expect(status).to.be.equal(404);
  });
});
