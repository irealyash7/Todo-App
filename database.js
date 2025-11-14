require('dotenv').config();
const mongoose = require("mongoose")
const Scehma = mongoose.Schema
const ObjectId = mongoose.ObjectId
mongoose.connect(process.env.mongo_link)

const User = new Schema({
    username: { type: String, unique: true },
    password: String
})

const Todo = new Schema({
    title: String,
    done: { type: Boolean, default: false },
    userId: ObjectId,
    deadline: { type: Date }
})

const UserModel = mongoose.model("users", User)
const TodoModel = mongoose.model("todos", Todo)

module.exports = { UserModel, TodoModel }























