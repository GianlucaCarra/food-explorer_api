const { verify } = require("jsonwebtoken");
const authConfig = require("../config/auth");
const AppError = require("../utils/AppError");

function ensureAuth(req, res, next) {
  const cookies = req.headers.cookie;

  if(!cookies) {
    throw new AppError('Not available JWT');
  }

  const [ ,token] = cookies.split("token=");

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