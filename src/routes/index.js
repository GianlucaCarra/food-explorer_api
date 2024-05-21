const { Router } = require("express");
const routes = Router();

const userRoutes = require("./user.routes");
const mealsRoutes = require("./meals.routes");
const sessionsRoutes = require("./sessions.routes");

routes.use("/user", userRoutes);
routes.use("/meals", mealsRoutes);
routes.use("/sessions", sessionsRoutes);

module.exports = routes;