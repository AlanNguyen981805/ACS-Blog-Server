import { Request, Response } from "express"
import Mongoose  from "mongoose"
import { IReqAuth } from "../configs/interfaces"
import categoryModel from "../models/categoryModel"
import { convertToSlug } from "../utils/helper"
import Blogs from "./../models/blogModel"

const BlogController = {
    createBlog: async (req: IReqAuth, res: Response) => {
        if(!req.user) return res.status(400).json({msg: "Có lỗi trong quá trình xác thực"})
        try {
            const { title, description, content, category, thumbnail } = req.body
            const newBlog = new Blogs({
                user: req.user._id,
                title,
                slug: convertToSlug(title),
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
                { $sort: { createdAt: -1 } },

                //group by category 
                {
                    $group: {
                        _id: "$category._id",
                        name: { $first: "$category.name" },
                        slug: { $first: "$category.slug"},
                        blog: {
                            $push: "$$ROOT"
                        },
                        count: {
                            $sum: 1
                        }
                    }
                },
            ])
            return res.json(blogs)
        } catch (error: any) {
            return res.status(400).json({msg: error.message})
        }
    },

    getBlog: async (req: Request, res: Response) => {
        try {
            const blog = await Blogs.findOne({slug: req.params.slug})
            if(!blog) return res.status(400).json({msg: "Không tìm thấy blog"})
            return res.json(blog)
        } catch (error: any) {
            return res.status(400).json({msg: error.message})
        }
    },

    getBlogByCategory: async(req: Request, res: Response) => {
        const Category = await categoryModel.findOne({slug: req.params.category_id}).select("_id")
        if(!Category) return res.status(400).json({msg: "Không tìm thấy loại tin"})
        try {
            const Data = await Blogs.aggregate([
                {
                    $facet: {
                        totalData: [
                            {
                                $match: {
                                    category: Category._id
                                }
                            },
                            {
                                $lookup: {
                                    from: "users",
                                    let: { user_id: "$user" },
                                    pipeline: [
                                        { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                                        { $project: {password: 0}}
                                    ],
                                    as: "user"
                                }
                            },
                            {
                                $unwind: "$user"
                            },
                            {
                                $sort: { createdAt: -1 }
                            }
                        ],
                        totalCount: [
                            { 
                                $match: {
                                    category: Category._id
                                }
                            },
                            {$count: 'count'}
                        ],

                    }
                },
                {
                    $project: {
                        count: { $arrayElemAt: ["$totalCount.count", 0] },
                        totalData: 1
                    }
                }
            ])

            const blogs = Data[0].totalData
            const count = Data[0].count

            return res.json({blogs, count})
        } catch (error) {
            console.log(error)
        }
    }



}

export default BlogController