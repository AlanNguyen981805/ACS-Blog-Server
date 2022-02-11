import { Router } from "express";
import BlogController from "../controllers/blogController";
import auth from "../middlewares/auth";

const router = Router()

router.post('/blog', auth, BlogController.createBlog)

export default router;