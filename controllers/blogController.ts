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
    },
    getHomeBlogs: async (req: Request, res: Response) => {
        try {
            const blogs = await Blogs.aggregate([
                {
                    $lookup: {
                        from: "users",
                        let: { user_id: "$user" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$user_id"]
                                    }
                                }
                            },
                            {
                                $project: {
                                    password: 0
                                }
                            }
                        ],
                        as: "users"
                    }
                },
                { $unwind: "$users" },
                {
                    $lookup: {
                        "from": "categories",
                        localField: "category",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                { $unwind: "$category" },

                // sorf
                { $sort: { "createAt": -1 } },

                //group by category 
                {
                    $group: {
                        _id: "$category._id",
                        name: { $first: "$category.name" },
                        blog: {
                            $push: "$$ROOT"
                        },
                        count: {
                            $sum: 1
                        }
                    }
                }
            ])
            return res.json(blogs)
        } catch (error: any) {
            return res.status(400).json({msg: error.message})
        }
    },

    getBlog: async (req: Request, res: Response) => {
        try {
            const blog = await Blogs.findOne({_id: req.params.id})
            if(!blog) return res.status(400).json({msg: "Không tìm thấy blog"})
            return res.json(blog)
        } catch (error: any) {
            return res.status(400).json({msg: error.message})
        }
    },

}

export default BlogController