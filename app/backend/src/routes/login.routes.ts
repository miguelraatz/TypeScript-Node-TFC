import { Request, Router, Response } from 'express';
import UserController from '../controllers/UserController';
import UserModel from '../models/UserModel';
import EncrypterBcryptService from '../services/EncrypterBcryptService';
import TokenGeneratorJwt from '../services/TokenGeneratorJwt';
import UserService from '../services/UserService';
import ValidateLogin from '../middlewares/ValidateLogin';

const userModel = new UserModel();
const encrypter = new EncrypterBcryptService();
const tokenGenerator = new TokenGeneratorJwt();
const userService = new UserService(userModel, encrypter, tokenGenerator);
const userController = new UserController(userService);

const router = Router();

router.post(
  '/',
  ValidateLogin.validateUser,
  (req: Request, res: Response) => userController.login(req, res),
);

export default router;
