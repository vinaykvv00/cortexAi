import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
dotenv.config()

const port = process.env.PORT

const app = express()

app.get("/", (req, res) => {
    //  res.send("Hello from the auth server!")
    res.json({ message: "Hello from the auth server!" })
})

app.listen(port, () => {
    console.log(`auth server is running on port ${port}`)
    connectDb()
})