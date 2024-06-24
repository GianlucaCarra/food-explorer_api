require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const routes = require("./routes");
const AppError = require("./utils/AppError");
const app = express();
const PORT = 3334;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    "https://food-explorer-web-ten.vercel.app",
  ],
  credentials: true
}));

app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'directive=value');
  next();
});

app.use(routes);

app.use((error, req, res, next) => {
  if(error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  }

  console.log(error);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
})

app.listen(PORT);