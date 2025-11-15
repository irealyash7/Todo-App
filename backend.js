require('dotenv').config();
const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const jwt_secret = process.env.jwt_secret
const path = require("path")
const z = require("zod")
const bcrypt = require("bcrypt")
const { UserModel, TodoModel } = require("./database")
const auth=require('./database')
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

    if (!founduser){return res.json({ msg: "Invalid username or password!" })}

    let passwordmatch = await bcrypt.compare(password, founduser.password)

    if (parsed.success && passwordmatch) {
        

        let token = jwt.sign({ UserId: founduser._id.toString() }, jwt_secret)

        res.json({
            msg: "Signed in Successfully!",
            token
        })

    } else { res.json({ msg: "Invalid username or password!" }) }

})


app.listen(3000)



















