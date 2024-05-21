const { Router } = require("express")
const userRoutes = Router();

const UserController = require("../controllers/UserController");
const userController = new UserController();

userRoutes.post("/", userController.create);

module.exports = userRoutes;