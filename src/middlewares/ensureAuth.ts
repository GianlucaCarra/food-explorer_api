import { Request, Response, NextFunction } from "express";
const { verify } = require("jsonwebtoken");
const authConfig = require("../config/auth");
const AppError = require("../utils/AppError");

export interface IRequestMiddleware extends Request {
  user: {
    id: number,
    role: string
  }
}

function ensureAuth(req: IRequestMiddleware, res: Response, next: NextFunction) {
  const cookies = req.cookies;
  const { token } = cookies;

  if(!token) {
    throw new AppError('Not available JWT');
  }
  
  try {
    const { role, sub: user_id } = verify(token, authConfig.jwt.secret);

    req.user = {
      id: Number(user_id),
      role
    }

    return next();
  } catch {
    throw new AppError('Invalid JWT');
  }
}

module.exports = ensureAuth;