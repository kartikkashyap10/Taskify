const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); 
    }
};

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String
});

const TodoSchema = new Schema({
    userId: ObjectId,
    title: String,
    done: Boolean
});

const User = mongoose.model('users', UserSchema);
const Todo = mongoose.model('todo', TodoSchema);

module.exports = {
    User,
    Todo,
    connectToDatabase
}
