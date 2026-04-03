import { userModel } from "../Model/auth.Model.js";
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const lastUser = await userModel.findOne().sort({ userId: -1 });
        const newUserId = lastUser ? lastUser.userId + 1 : 1;

        const newUser = new userModel({
            userId: newUserId,
            name,
            email,
            password,
            role
        })

        await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
        })

    } catch (error) {
        console.log("Error in registerUser controller:", error);
        res.status(500).json({
            message: error.message
        })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: "JWT secret not configured on server",
            });
        }

        const token = jwt.sign(
            {
                userId: user.userId,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Login successful",
            token: token
        })
    } catch (error) {
        console.log("Error in loginUser controller:", error);
        res.status(500).json({
            message: error.message
        })
    }
}