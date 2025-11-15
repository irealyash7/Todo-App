require('dotenv').config();
const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const jwt_secret = process.env.JWT_SECRET
const path = require("path")
const z = require("zod")
const bcrypt = require("bcrypt")
const { UserModel, TodoModel } = require("./database")
const auth = require('./authorization')
app.use(express.static(path.join(__dirname, "files")))
app.use(express.json())


app.post("/signup", async function (req, res) {

    let { username, password } = req.body

    let check = z.object({
        username: z.string().max(30),
        password: z.string().min(5).max(100).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    })

    let parsed = check.safeParse(req.body)

    if (parsed.success) {

        let hashedpassword = await bcrypt.hash(password, 5)
        try {
            await UserModel.create({
                username: username,
                password: hashedpassword
            })

            res.json({ msg: "User registered successfully!" })
        }
        catch (error) {
            console.log(error)
            res.json({ msg: "User already exists!" })
        }

    } else { res.json({ msg: "Password must be 6-20 characters and should contain upper case, number, and special character." }) }

})

app.post("/signin", async function (req, res) {

    let { username, password } = req.body

    let check = z.object({
        username: z.string().max(30),
        password: z.string().min(5).max(100).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    })

    let parsed = check.safeParse(req.body)

    let founduser = await UserModel.findOne({ username })

    if (!founduser) { return res.json({ msg: "Invalid username or password!" }) }

    let passwordmatch = await bcrypt.compare(password, founduser.password)

    if (parsed.success && passwordmatch) {


        let token = jwt.sign({ UserId: founduser._id.toString() }, jwt_secret)

        res.json({
            msg: "Signed in Successfully!",
            token
        })

    } else { res.json({ msg: "Invalid username or password!" }) }

})

app.get("/todos", auth, async function (req, res) {
    let todos = await TodoModel.find({ UserId: req.UserId })
    res.json({ todos })
})

app.post("/todos", auth, async function (req, res) {
    await TodoModel.create({ title: req.body.title, UserId: req.UserId })
    res.json({})
})

app.put("/todos", auth, async function (req, res) {
    await TodoModel.findByIdAndUpdate(req.body.id, { title: req.body.title, UserId: req.UserId })
    res.json({})
})


app.delete("/todos", auth, async function (req, res) {
    await TodoModel.findByIdAndDelete(req.body.id)
    res.json({})
})

app.put("/todos/done", auth, async function (req, res) {
    let founduser = await TodoModel.findById(req.body.id)
    if (founduser.done === false) { founduser.done = true, await founduser.save() }
    else { founduser.done = false, await founduser.save() }
    res.json({})
})



app.listen(3000)



















