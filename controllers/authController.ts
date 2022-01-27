import { Request, Response } from "express"
import User from "../models/userModel"
import bcrypt from "bcrypt"
import { generateActiveToken } from "../configs/generateToken"
import jwt from "jsonwebtoken"
import { IDecodeToken } from "../configs/interfaces"
import { validateEmail } from "../middlewares/valid"
import sendEmail from "../configs/sendEmail"

const CLIENT_URL = `${process.env.BASE_URL}`

const authController = {
    register: async (req: Request, res: Response) => {
        try {
            const { name, account, password } = req.body
            if (!name || !account || !password) return res.status(500).json({ msg: 'Vui lòng nhập đầy đủ các trường yêu cầu' })

            const user = await User.findOne({ account })
            if (user) return res.status(400).json({ msg: "Email đã tồn tại" })

            const passwordHash = await bcrypt.hash(password, 12)

            const newUser = { name, account, password: passwordHash }

            const active_token = generateActiveToken({ newUser })

            const url_active = `${CLIENT_URL}/active/${active_token}`
            if(validateEmail(account)) {
                sendEmail(account, url_active, 'Xác thực email của bạn')
                return res.json('Vui lòng check mail để kích hoạt tài khoản')
            } else {
                return res.status(400).json({msg: "Email không hợp lệ"})
            }
        } catch (error: any) {
            return res.status(500).json({ msg: error.message })
        }
    },
    activeAccount: async (req: Request, res: Response) => {
        try {
            const { active_token } = req.body
            const decoded = <IDecodeToken>jwt.verify(active_token, `shhhhh`)
            const { newUser } = decoded
            if (!newUser) return res.status(400).json({ msg: 'Invalid Authentication' })

            const user = await User.findOne({ account: newUser.account })
            if (user) return res.status(400).json({ msg: 'Tài khoản đã tồn tại' })

            const new_user = new User(newUser)

            await new_user.save()

            res.json({msg: 'Tài khoản đã được kích hoạt'})
        } catch (error) {
            return res.status(500).json({ msg: error })
        }
    }
}
export default authController