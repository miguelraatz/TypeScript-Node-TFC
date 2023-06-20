import { Request, Response } from 'express';
import LeaderBoardServiceHome from '../services/LeaderBoardServiceHome';
import LeaderBoardServiceAway from '../services/LeaderBoardServiceAway';
import LeaderBoardService from '../services/LeaderBoardService';

export default class LeaderBoardController {
  constructor(
    private leaderBoardServiceHome = new LeaderBoardServiceHome(),
    private leaderBoardServiceAway = new LeaderBoardServiceAway(),
    private leaderBoardService = new LeaderBoardService(),
  ) {}

  public async leaderBoard(req: Request, res: Response): Promise<Response> {
    const patch = req.originalUrl;
    if (patch === '/leaderboard') {
      const serviceResponse = await this.leaderBoardService.leaderBoard();
      return res.status(200).json(serviceResponse);
    }
    if (patch === '/leaderboard/home') {
      const serviceResponse = await this.leaderBoardServiceHome.leaderBoardHome();
      return res.status(200).json(serviceResponse);
    }
    const serviceResponse = await this.leaderBoardServiceAway.leaderBoardAway();
    return res.status(200).json(serviceResponse);
  }
}
