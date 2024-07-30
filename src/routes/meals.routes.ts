import { Router } from "express";
const multer = require("multer");
const mealsRoutes = Router();
const upload = multer();

const MealsController = require("../controllers/MealsController");
const mealsController = new MealsController();

const verifyRole = require("../middlewares/verifyRole");
const ensureAuth = require("../middlewares/ensureAuth");

mealsRoutes.use(ensureAuth);

mealsRoutes.post("/create", verifyRole(["admin"]), upload.single("img"), mealsController.create);
mealsRoutes.delete("/delete/:id", verifyRole(["admin"]), mealsController.delete);
mealsRoutes.patch("/update/:id", verifyRole(["admin"]), upload.single("img"), mealsController.update);
mealsRoutes.get("/index", mealsController.index);
mealsRoutes.get("/search", mealsController.search);
mealsRoutes.get("/:id", mealsController.show);

module.exports = mealsRoutes;