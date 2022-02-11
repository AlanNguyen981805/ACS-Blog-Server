import mongoose from "mongoose"

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 20,
        maxlength: 50
    },
    content: {
        type: String,
        required: true,
        minlength: 2000
    },
    description: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    category: {
        type: String
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

export default mongoose.model('blog', blogSchema)