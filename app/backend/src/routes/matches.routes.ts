import { Request, Router, Response } from 'express';
import MatchModel from '../models/MatchModel';
import MatchService from '../services/MatchService';
import MatchController from '../controllers/MatchController';

const matchModel = new MatchModel();
const matchService = new MatchService(matchModel);
const matchController = new MatchController(matchService);

const router = Router();

router.get('/', (req: Request, res: Response) => matchController.getAllMatches(req, res));

export default router;
