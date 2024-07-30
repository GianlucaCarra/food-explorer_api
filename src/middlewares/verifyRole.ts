import { NextFunction, Response } from "express";
import { IRequestMiddleware } from "./ensureAuth";

const AppError = require("../utils/AppError");

function verifyRole(roleToVerify: string[]) {
  return (req: IRequestMiddleware, res: Response, next: NextFunction) => {
    const { role } = req.user;

    if(!roleToVerify.includes(role)) {
      throw new AppError("Unauthorized", 401);
    }

    return next()
  }
}

module.exports = verifyRole;