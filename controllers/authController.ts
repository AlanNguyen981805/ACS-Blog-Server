import { Request, Response } from "express"
import User from "../models/userModel"
import bcrypt from "bcrypt"
import { generateAccessToken, generateActiveToken, generateRefeshToken } from "../configs/generateToken"
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
            if (user) return res.status(400).json({ msg: {account: "Email đã tồn tại"} })

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
    },
    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({account: email})
            if(!user) return res.status(400).json({msg: {
                email: "Không tìm thấy tài khoản"
            }})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: {
                password: "Mật khẩu không đúng"
            }})

            const access_token = generateAccessToken({id: user._id})
            const refresh_token = generateRefeshToken({id: user._id}, res)

            await User.findOneAndUpdate({id: user._id}, {
                rf_token: refresh_token
            })

            res.json({
                msg: 'Đăng nhập thành công',
                access_token,
                user: {...user._doc, password: ''}
            })
        } catch (error) {
            res.json({
                msg: 'Đăng nhập thaast bai'
            })
        }
    },
    refreshToken: async (req: Request, res: Response) => {
        
        try {
            const rf_token = req.cookies.refresh_token
            
            if(!rf_token) return res.status(400).json({msg: 'Vui lòng đăng nhập'})
            // const decode
            
            const decoded = <IDecodeToken>jwt.verify(rf_token, `refresh_token_serect`) 
            if(!decoded.id) return res.status(400).json({msg: ' Vui long dang nhap'})

            const user = await User.findById(decoded.id).select('-password +rf_token')
            if(!user) return res.status(400).json({msg: "User không tồn tại"})

            if(rf_token !== user.rf_token)
            return res.status(400).json({msg: "Vui lòng đăng nhậpp"})

            const access_token = generateAccessToken({id: user._id  }) 
            const refresh_token = generateRefeshToken({id: user._id}, res)
            
            // console.log({refresh_token, access_token})
            await User.findOneAndUpdate({_id: user._id}, {
                rf_token: refresh_token
            })
           

            return res.json({access_token, user, rf_token: refresh_token})
        } catch (error: any) {
            console.log(error)
            return res.status(500).json({msg: error.message})
        }
    },
    logout: async (req: Request, res: Response) => {
        res.clearCookie('refresh_token')
        res.status(200).json({msg: "Đăng xuất thành công"})
    }
}
export default authController