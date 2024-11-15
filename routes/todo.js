const express = require("express");
const { Todo } = require("../database/db");
const { authenticateJwt } = require("../middlewares/auth");
const { StatusCodes } = require("http-status-codes");
const { z } = require("zod");

const router = express.Router();
router.use(authenticateJwt);

router.get("/", async (req, res) => {
    try {
        const todos = await Todo.find({
            userId: req.userId
        });

        res.status(StatusCodes.OK).json({
            data: todos
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong."
        });
    }
});

router.post("/create", async (req, res) => {
    try {
        // Input validation
        const requiredBody = z.object({
            taskTitle: z.string().min(3).max(50),
        });

        const { success, data } = requiredBody.safeParse(req.body);
        if (!success) {
            res.status(StatusCodes.BAD_REQUEST).send({ message: "Invalid input." });
            return;
        }

        const { taskTitle } = data;
        await Todo.create({
            userId: req.userId,
            title: taskTitle,
            done: false
        });

        res.status(StatusCodes.CREATED).json({ message: "Successful." });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Something went wrong."
        });
    }
});

router.patch("/update/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;

        await Todo.updateOne(
            { _id: id },
            updatedData
        );

        res.status(StatusCodes.OK).json({
            message: "Updated."
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong."
        });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;

        await Todo.deleteOne(
            { _id: id }
        );

        res.status(StatusCodes.OK).json({
            message: "Deleted."
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong. "
        });
    }
});

module.exports = router;
