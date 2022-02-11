import { Response } from "express"
import jwt from "jsonwebtoken"

const {
    ACTIVE_TOKEN_SECRET,
    ACCESS_TOKEN_SECRET
} = process.env

export const generateActiveToken = (payload: object) => {
    return jwt.sign(payload, `shhhhh`, {expiresIn: "5m"})
}

// export const generateAccessToken = (payload: object) => {
//     return jwt.sign(payload, `access_serect`, {expiresIn: "5m"})
// }

// export const generateRefeshToken = (payload: object, res: Response) => {
//     const refresh_token = jwt.sign(payload, `refresh_token_serect`, {expiresIn: "30d"})
//     res.cookie('refresh_token', refresh_token, {
//         httpOnly: true,
//         path: 'api/refresh_token',
//         maxAge: 30*24*60*60*1000 //30days
//     })

//     return refresh_token
// }
export const generateAccessToken = (payload: object) => {
    return jwt.sign(payload, `access_serect`, {expiresIn: "20s"})
}

export const generateRefeshToken = (payload: object, res: Response) => {
    const refresh_token = jwt.sign(payload, `refresh_token_serect`, {expiresIn: "30d"})
    res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        secure: false,
        path: "/",
        maxAge: 30*24*60*60*1000, // 30d,
    })
    return refresh_token
}