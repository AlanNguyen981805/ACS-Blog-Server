import { Request, Response } from "express";
import { IReqAuth } from "../configs/interfaces";
import Categories from "../models/categoryModel"

const categoryController = {
    createCategory: async(req: IReqAuth, res: Response) => {
        if(!req.user) return res.status(400).json({msg: "Token không hợp lệ"});
        if(req.user.role !== "admin") return res.status(403).json({msg: "Bạn không có quyền tạo "})
        
        try {
            const { name } = req.body
            const category = await Categories.findOne({name})
            if(category) return res.status(400).json({msg: "Loại tin đã tồn tại"})

            const newCategory = await new Categories({name})
            await newCategory.save()

            return res.json({newCategory})
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    },
    getCategories: async (req: IReqAuth, res: Response) => {
        if(!req.user) return res.status(400).json({msg: "Không tìm thấy User"})
        if(req.user.role !== "admin") return res.status(403).json({msg: "Bạn không có quyền"}) 
        try {
            const categories = await Categories.find().sort("-createAt")
            return res.json({categories})
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    }
}

export default categoryController