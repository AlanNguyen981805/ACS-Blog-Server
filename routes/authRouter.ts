import express from "express"
import authController from "../controllers/authController"

const router = express.Router()

router.post('/register', authController.register)
router.post('/active', authController.activeAccount)

export default router