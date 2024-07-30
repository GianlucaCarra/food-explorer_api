import { Router } from "express";
const userRoutes = Router();

const UserController = require("../controllers/UserController");
const userController = new UserController();

userRoutes.post("/", userController.create);

module.exports = userRoutes;