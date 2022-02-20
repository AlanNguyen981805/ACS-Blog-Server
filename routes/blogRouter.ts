import { Router } from "express";
import BlogController from "../controllers/blogController";
import auth from "../middlewares/auth";

const router = Router()

router.post('/blog', auth, BlogController.createBlog)
router.get('/blogs', BlogController.getHomeBlogs)
router.get('/blog/:id', BlogController.getBlog)

export default router;