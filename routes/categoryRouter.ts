import express from "express";
import categoryController from "../controllers/categoryController";
import auth from "../middlewares/auth";

const router = express.Router()

router.post("/category", auth, categoryController.createCategory)
router.get("/categories", auth, categoryController.getCategories)

export default router;