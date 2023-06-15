import { Request, Response } from 'express';
import MatchService from '../services/MatchService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class MatchController {
  constructor(
    private matchService: MatchService,
  ) { }

  public async getAllMatches(req: Request, res: Response): Promise<Response> {
    const { inProgress } = req.query;
    if (!inProgress) {
      const serviceResponse = await this.matchService.getAllMatches();
      const statusCode = mapStatusHTTP(serviceResponse.status);
      return res.status(statusCode).json(serviceResponse.data);
    }
    const progress = inProgress === 'true';
    const serviceResponse = await this.matchService.getMatchesInProgress(progress);
    const statusCode = mapStatusHTTP(serviceResponse.status);
    return res.status(statusCode).json(serviceResponse.data);
  }

  public async finishMatch(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const serviceResponse = await this.matchService.finishMatch(Number(id));
    return res.status(200).json(serviceResponse.data);
  }
}
