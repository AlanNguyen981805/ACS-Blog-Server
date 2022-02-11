import { Request, Response } from "express"
import { IReqAuth } from "../configs/interfaces"
import Blogs from "./../models/blogModel"

const BlogController = {
    createBlog: async (req: IReqAuth, res: Response) => {
        if(!req.user) return res.status(400).json({msg: "Có lỗi trong quá trình xác thực"})
        try {
            const { title, description, content, category, thumbnail } = req.body
            const newBlog = new Blogs({
                user: req.user._id,
                title,
                description,
                content,
                category,
                thumbnail
            })

            await newBlog.save()
            res.json({newBlog})
        } catch (error: any) {
            return res.status(400).json({msg: error.message})
        }
    }
}

export default BlogController