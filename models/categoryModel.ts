import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Vui lòng nhập loại tin"],
        trim: true,
        unique: true,
        maxlength: [50, "Tên không được quá 50 ký tự"]
    }
}, {
    timestamps: true
})

export default mongoose.model("categories", categorySchema)