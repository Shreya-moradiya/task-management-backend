import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    taskId: {
        type: Number,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        required: true
    },
    assignTo: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "Users"
        type: Number
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending",
    },
    dueDate: {
        type: Date,
        required: true
    },
    createdBy: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    updatedAt: {
        type: Date
    },
    completedAt: {
        type: Date
    },
    comments: {
        type: String
    }
}, {
    versionKey: false,
    timestamps: true
})

export const taskModel = mongoose.model("GetTask", taskSchema, "Task");