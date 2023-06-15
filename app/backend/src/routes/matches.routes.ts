import { Request, Router, Response, NextFunction } from 'express';
import MatchModel from '../models/MatchModel';
import MatchService from '../services/MatchService';
import MatchController from '../controllers/MatchController';
import ValidateToken from '../middlewares/ValidateToken';
import TokenGeneratorJwt from '../services/TokenGeneratorJwt';

const matchModel = new MatchModel();
const matchService = new MatchService(matchModel);
const matchController = new MatchController(matchService);
const tokenGenerator = new TokenGeneratorJwt();
const validateToken = new ValidateToken(tokenGenerator);

const router = Router();

router.get('/', (req: Request, res: Response) => matchController.getAllMatches(req, res));

router.patch(
  '/:id/finish',
  (req: Request, res: Response, next: NextFunction) => validateToken.validateToken(req, res, next),
  (req: Request, res: Response) => matchController.finishMatch(req, res),
);

router.patch(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => validateToken.validateToken(req, res, next),
  (req: Request, res: Response) => matchController.updateMatch(req, res),
);

export default router;
