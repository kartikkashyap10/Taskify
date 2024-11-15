const express = require("express");
const cors = require("cors");

const { connectToDatabase } = require("./database/db");
const userRouter = require("./routes/user");
const todoRouter = require("./routes/todo");

require("dotenv").config();

const app = express();

// Load Middlewares
app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.use("/todo", todoRouter);

connectToDatabase().then(() => {
    const BASE_URL = process.env.BASE_URL;
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`server up on ${BASE_URL}:${PORT}`);
    });
});




