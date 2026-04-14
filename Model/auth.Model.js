import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: { type: Number, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, min: 6 },
    role: {
        type: String,
        enum: ['admin', "employee"],
        default: 'admin'
    },
    companyId: {
        type: Number,
        required: true
    }
},
    {
        versionKey: false
    }
)

export const userModel = mongoose.model("Users", userSchema, "Users");