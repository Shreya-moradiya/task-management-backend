import { userModel } from "../Model/auth.Model.js";
import jwt from 'jsonwebtoken';
import { companyModel } from "../Model/compnay.Model.js";
import bcrpt from "bcrypt";

export const RegisterUser = async (req, res) => {
    try {
        const { compnayName, name, email, password } = req.body;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const lastCompany = await companyModel.findOne().sort({ compnayId: -1 });
        const newCompanyId = lastCompany ? lastCompany.compnayId + 1 : 1;

        const company = await companyModel.create({
            compnayId: newCompanyId,
            compnayName: compnayName
        });

        const hashPassword = await bcrpt.hash(password, 10);

        const lastUser = await userModel.findOne().sort({ userId: -1 });
        const newUserId = lastUser ? lastUser.userId + 1 : 1;

        const newUser = new userModel({
            userId: newUserId,
            name,
            email,
            password: hashPassword,
            // role,
            companyId: company.compnayId
        });

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
                message: "Invalid email or password"
            });
        }

        // if (user.password !== password) {
        //     return res.status(401).json({
        //         message: "Invalid password"
        //     });
        // }

        const isMtach = await bcrpt.compare(password, user.password);

        if (!isMtach) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: "JWT secret not configured on server",
            });
        }
        const token = jwt.sign(
            {
                userId: user.userId,
                role: user.role,
                name: user.name,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                userId: user.userId,
                role: user.role,
                name: user.name,
            }
        })

    } catch (error) {
        console.log("Error in loginUser controller:", error);
        res.status(500).json({
            message: error.message
        })
    }
}