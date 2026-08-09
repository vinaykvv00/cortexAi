import express from "express"
import dotenv from "dotenv"
dotenv.config()
import proxy from "express-http-proxy"
import cors from "cors"
import cookieParser from "cookie-parser"

const port = process.env.PORT

const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(cookieParser())
const authServiceUrl = process.env.AUTH_SERVICE
app.use("/auth", proxy(authServiceUrl))

app.get("/", (req, res) => {
    //  res.send("Hello from the gateway server!")
    res.json({ message: "Hello from the gateway server!" })
})

app.listen(port, () => {
    console.log(`gateway server is running on port ${port}`)
})
