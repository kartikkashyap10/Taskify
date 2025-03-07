const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../database/db");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const { z } = require("zod");

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        // input validation
        const requiredBody = z.object({
            name: z.string().min(3).max(50),
            email: z.string().email(),
            password: z.string().min(3).max(50)
        });

        console.log(req.body);
        const { success, data } = requiredBody.safeParse(req.body);
        if (!success) {
            res.status(StatusCodes.BAD_REQUEST).send({ message: "Invalid input." });
            return;
        }

        const { name, email, password } = data;


        const user = await User.find({
            email: email
        });

        if (user.length > 0) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "User already exists!" });
            return;
        }

        // password hashing
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name: name,
            email: email,
            password: hashedPassword,
        });

        res.json({
            message: "Succesfully signed up.",
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong.",
        });
    }
});

router.post("/signin", async (req, res) => {
    try {
        // input validation
        const requiredBody = z.object({
            email: z.string().email(),
            password: z.string().min(3).max(100)
        });

        const { success, data } = requiredBody.safeParse(req.body);
        if (!success) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Invalid input."
            });
            return;
        }

        const { email, password } = data;
        const user = await User.findOne({
            email: email,
        });
        
        if(!user) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "User doesn't exist."
            });
            return;
        }
        const passwordMatch = bcrypt.compare(password, user.password);

        if (user && passwordMatch) {
            const JWT_SECRET = process.env.JWT_SECRET;
            const token = jwt.sign(
                {
                    id: user._id.toString(),
                },
                JWT_SECRET
            );

            res.json({ token });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({
                message: "Unauthorized!",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong.",
        });
    }
});

module.exports = router;

