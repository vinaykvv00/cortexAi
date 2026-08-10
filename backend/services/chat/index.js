import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import router from "./routes/chat.routes.js"
dotenv.config()

const port = process.env.PORT

const app = express()
app.use(express.json())

app.use("/", router)

app.get("/", (req, res) => {
    //  res.send("Hello from the auth server!")
    res.json({ message: "Hello from the chat server!" })
})

app.listen(port, () => {
    console.log(`chat server is running on port ${port}`)
    connectDb()
})