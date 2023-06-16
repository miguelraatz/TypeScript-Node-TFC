import { Request, Router, Response } from 'express';
import LeaderBoardController from '../controllers/LeaderBoardController';

const leaderBoardController = new LeaderBoardController();

const router = Router();

router.get('/', (req: Request, res: Response) => leaderBoardController.leaderBoardHome(req, res));

export default router;
