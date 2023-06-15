import { Request, Router, Response, NextFunction } from 'express';
import UserController from '../controllers/UserController';
import UserModel from '../models/UserModel';
import EncrypterBcryptService from '../services/EncrypterBcryptService';
import TokenGeneratorJwt from '../services/TokenGeneratorJwt';
import UserService from '../services/UserService';
import ValidateLogin from '../middlewares/ValidateLogin';
import ValidateToken from '../middlewares/ValidateToken';

const userModel = new UserModel();
const encrypter = new EncrypterBcryptService();
const tokenGenerator = new TokenGeneratorJwt();
const userService = new UserService(userModel, encrypter, tokenGenerator);
const validateToken = new ValidateToken(tokenGenerator);
const userController = new UserController(userService);

const router = Router();

router.post(
  '/',
  ValidateLogin.validateUser,
  (req: Request, res: Response) => userController.login(req, res),
);

router.get(
  '/role',
  (req: Request, res: Response, next: NextFunction) => validateToken.validateToken(req, res, next),
  (req: Request, res: Response) => UserController.getRoleUser(req, res),
);

export default router;
