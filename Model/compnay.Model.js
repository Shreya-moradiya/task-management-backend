import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    compnayId: {
        type: Number,
        unique: true
    },
    compnayName: {
        type: String,
        required: true
    }
},
    {
        versionKey: false
    }
)

export const companyModel = mongoose.model("Company", companySchema, "Company");