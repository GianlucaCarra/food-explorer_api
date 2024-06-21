const { Router } = require("express")
const sessionsRoutes = Router();

const SessionsController = require("../controllers/SessionsController");
const sessionsController = new SessionsController();
const ensureAuth = require("../middlewares/ensureAuth");

sessionsRoutes.post("/", sessionsController.create);
sessionsRoutes.delete("/logout", sessionsController.delete);
sessionsRoutes.get("/role", sessionsController.show);

module.exports = sessionsRoutes;