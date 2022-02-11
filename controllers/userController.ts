import { Request, Response } from "express";
import Users from "../models/userModel";

const userController = {
    getAllUsers: async(req: Request, res: Response) => {
        try {
            const users = await Users.find();
            if(!users) return res.status(404).json({msg: "Không tìm thấy user"})

            return res.status(200).json(users)
        } catch (error) {
            
        }
    },
    deleteUser: async (req: Request, res: Response) => {
        try {
             const user = await Users.findById(req.params.id)
             return res.status(200).json("Delete Success")
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

export default userController