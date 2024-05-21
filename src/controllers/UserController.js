const knex = require("../../database/knex");
const AppError = require("../utils/AppError");
const { hash } = require("bcryptjs");

class UserController {
  async create(req, res) {
    const { name, email, password } = req.body;

    const checkIfUserExists = await knex("users").where({ email }).first();

    if(checkIfUserExists) {
      throw new AppError("This e-mail is alredy taken!");
    }

    if(password.length < 6) {
      throw new AppError("The password must have 6 characters!");
    }

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({
      name,
      email,
      password: hashedPassword
    });

    return res.json();
  }
}

module.exports = UserController;