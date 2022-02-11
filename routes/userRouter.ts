import express from "express"
import userController from "../controllers/userController"
import auth from "../middlewares/auth"

const router = express.Router()

router.get("/users", userController.getAllUsers)

router.delete("/:id", auth, userController.deleteUser)

export default router