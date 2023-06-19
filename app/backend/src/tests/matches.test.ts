import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');

const jwtPayload = {
  email: 'admin@admin.com',
  role: 'admin'
}

export const goalsUpdated = {
	homeTeamGoals: 3,
	awayTeamGoals: 1
}

import { app } from '../app';
import SequelizeMatches from '../database/models/SequelizeMatches';

import { matchesMock, matchesInProgress, matchInvalid, newMatch, createdMatch } from './mocks/matches.mocks';
import SequelizeTeams from '../database/models/SequelizeTeams';

chai.use(chaiHttp);

const { expect } = chai;

describe('testing route /matches', () => {
  afterEach(() => sinon.restore())
  describe('testing route /matches', () => {
    it('should return all matches', async () => {
    const { status } = await chai.request(app).get('/matches');
    expect(status).to.be.equal(200);
    });
    it('should return matches in progress', async () => {
    sinon.stub(SequelizeMatches, 'findAll').resolves(matchesInProgress as unknown as SequelizeMatches[])
    const { body } = await chai.request(app).get('/matches?inProgress=true');
    expect(body).to.deep.equal(matchesInProgress);
    });
  });
  describe('testing router PATCH /matches/:id/finish', () => {
    it('should return message', async () => {
      sinon.stub(jwt, 'verify').callsFake(() => jwtPayload);
      sinon.stub(SequelizeMatches, 'findOne').resolves(matchesMock[1] as unknown as SequelizeMatches);
      sinon.stub(SequelizeMatches, 'update').resolves([1]);

      const response = await chai.request(app).patch('/matches/41/finish')
        .set('Authorization', 'token');

      expect(response.body).to.be.deep.equal({ message: 'Finished' });
    });
    it('should return status 200 and a message', async () => {
      sinon.stub(jwt, 'verify').callsFake(() => jwtPayload);
      sinon.stub(SequelizeMatches, 'findOne').resolves(matchesMock[1] as unknown as SequelizeMatches);
      sinon.stub(SequelizeMatches, 'update').resolves([1]);
  
      const response = await chai.request(app).patch('/matches/1')
      .set('Authorization', 'token-valid')
      .send(goalsUpdated);
  
      expect(response.status).to.be.equal(200);
    });
    describe('testing create Match', () => {
      it('should return status 404 if no team has passed', async () => {
        sinon.stub(jwt, 'verify').callsFake(() => jwtPayload);
        sinon.stub(SequelizeTeams, 'findOne').resolves(undefined);
  
        const response = await chai.request(app).post('/matches')
          .set('Authorization', 'token-valid')
          .send(matchInvalid);
  
        expect(response.status).to.be.equal(404);
        expect(response.body).to.be.deep.equal({ message: 'There is no team with such id!' });
      });
      it('should return satus 201 with team created', async () => {
        sinon.stub(jwt, 'verify').callsFake(() => jwtPayload);
  
        const resolved = SequelizeMatches.build({ ...newMatch, inProgress: true })
        const resultCreatedMatch = SequelizeMatches.build(createdMatch)
        sinon.stub(SequelizeMatches, 'create').resolves(resolved);
        sinon.stub(SequelizeMatches, 'findOne').resolves(resultCreatedMatch);
  
  
        const response = await chai.request(app).post('/matches')
          .set('Authorization', 'token-valid')
          .send(newMatch);

          expect(response.status).to.be.equal(201);
      });
    });
  });
});
