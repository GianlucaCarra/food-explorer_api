import { Request, Response, NextFunction } from "express";
import { IAppError } from "./utils/AppError";

require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const AppError = require("./utils/AppError");
const app = express();
const PORT = 3334;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    "https://app.vististudi.online",
    "https://api.vististudi.online"
  ],
  credentials: true
}));

app.use(routes);

app.use((error: IAppError, req: Request, res: Response, next: NextFunction) => {
  if(error) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
})

app.listen(PORT, console.log("Running on: " + PORT));