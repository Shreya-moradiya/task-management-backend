import { userModel } from "../Model/auth.Model.js";
import bcrpt from "bcrypt";

export const getUser = async (req, res) => {
    try {
        const employees = await userModel.find(
            { role: "employee" },
            { userId: 1, name: 1 }
        );

        if (!employees) {
            return res.status(404).json({
                message: "No employees found"
            });
        }

        res.status(200).json({
            message: "Employees retrieved successfully",
            data: employees
        })
    } catch (error) {
        console.log("Error in getting user", error);
        res.status(500).json({
            message: error.message
        })
    }
}

export const addUser = async (req, res) => {
    try {
        const { name, email, password, role, companyId } = req.body;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashPassword = await bcrpt.hash(password, 10);

        const lastUser = await userModel.findOne().sort({ userId: -1 });
        let newUserId = 1;
        if (
            lastUser &&
            typeof lastUser.userId === "number" &&
            !Number.isNaN(lastUser.userId)
        ) {
            newUserId = lastUser.userId + 1;
        }

        const newUser = new userModel({
            userId: newUserId,
            name,
            email,
            password: hashPassword,
            role,
            companyId
        });

        await newUser.save();

        res.status(201).json({
            message: "User added successfully",
        })

    } catch (error) {
        console.log("Error in addUser controller:", error);
        res.status(500).json({
            message: error.message
        })
    }
}