import { Request, Response } from 'express';
import MatchService from '../services/MatchService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class MatchController {
  constructor(
    private matchService: MatchService,
  ) { }

  public async getAllMatches(req: Request, res: Response) {
    const serviceResponse = await this.matchService.getAllMatches();
    const statusCode = mapStatusHTTP(serviceResponse.status);
    return res.status(statusCode).json(serviceResponse.data);
  }
}
