const knex = require("../../database/knex")
const AppError = require("../utils/AppError");
const { compare } = require("bcryptjs");
const authConfig = require("../config/auth");
const { sign } = require("jsonwebtoken");

class SessionsController {
  async create(req, res) {
    const { email, password } = req.body;
    const user = await knex("users").where({ email }).first();

    if(!user) {
      throw new AppError("E-mail or password incorrect!", 401);
    }

    const passwordMatch = await compare(password, user.password);

    if(!passwordMatch) {
      throw new AppError("E-mail or password incorrect!", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({ role: user.role }, secret, {
      subject: String(user.id),
      expiresIn
    });

    return res.status(201).json({ user, token });
  }
}

module.exports = SessionsController;