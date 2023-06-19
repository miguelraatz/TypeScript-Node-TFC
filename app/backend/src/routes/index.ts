import { Router } from 'express';
import teamRouter from './teams.routes';
import loginRouter from './login.routes';
import matchesRouter from './matches.routes';
import leaderBoardRouter from './leaderboard.routes';

const router = Router();

router.use('/teams', teamRouter);
router.use('/login', loginRouter);
router.use('/matches', matchesRouter);
router.use('/leaderboard', leaderBoardRouter);

export default router;
