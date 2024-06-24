const { verify } = require("jsonwebtoken");
const authConfig = require("../config/auth");
const AppError = require("../utils/AppError");

function ensureAuth(req, res, next) {
  const cookies = req.cookies;
  console.log(cookies)

  if(!cookies.token) {
    throw new AppError('Not available JWT');
  }

  const token = cookies.token;

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