import { Request, Response } from "express"

const authController = {
    register: async(req: Request, res: Response) => {
        console.log(req.body)
    }
}

const registerUser = () => {

}

export default authController