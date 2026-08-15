import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import router from "./routes/agent.route.js"
dotenv.config()

const port = process.env.PORT

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/", router)

app.get("/", (req, res) => {
    //  res.send("Hello from the auth server!")
    res.json({ message: "Hello from the agent server!" })
})

app.listen(port, () => {
    console.log(`agent server is running on port ${port}`)
    connectDb()
})