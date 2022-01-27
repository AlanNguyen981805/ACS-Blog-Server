import jwt from "jsonwebtoken"

const {
    ACTIVE_TOKEN_SECRET,
    ACCESS_TOKEN_SECRET
} = process.env

export const generateActiveToken = (payload: object) => {
    return jwt.sign(payload, `shhhhh`, {expiresIn: "5m"})
}