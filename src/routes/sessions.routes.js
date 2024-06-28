const { Router } = require("express")
const sessionsRoutes = Router();

const SessionsController = require("../controllers/SessionsController");
const sessionsController = new SessionsController();
const ensureAuth = require("../middlewares/ensureAuth");

sessionsRoutes.post("/", sessionsController.create);
sessionsRoutes.delete("/logout", sessionsController.delete);
sessionsRoutes.get("/role", ensureAuth, sessionsController.show);
sessionsRoutes.post("/t", sessionsController.teste);

module.exports = sessionsRoutes;