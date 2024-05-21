const AppError = require("../utils/AppError");

function verifyRole(roleToVerify) {
  return (req, res, next) => {
    const { role } = req.user;

    if(!roleToVerify.includes(role)) {
      throw new AppError("Unauthorized", 401);
    }

    return next()
  }
}

module.exports = verifyRole;