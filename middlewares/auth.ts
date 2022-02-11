import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import Users from "./../models/userModel"
import { IDecodeToken, IReqAuth } from '../configs/interfaces';

const auth = async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization")
        if(!token) return res.status(400).json({msg: "Token không hợp lệ"})

        const decode = <IDecodeToken>jwt.verify(token, "access_serect")
        if(!decode) return res.status(400).json({msg: "Token không hợp lệ"})
        const user = await Users.findOne({_id: decode.id}).select("-password")
        if(!user) return res.status(400).json({msg: "Không tìm thấy user"})

        req.user = user
        next()
    } catch (error: any) {
        return res.status(500).json({msg: error.message})
    }
} 

export default auth