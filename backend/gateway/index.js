import express from "express"
import dotenv from "dotenv"
dotenv.config()
import proxy from "express-http-proxy"

const port = process.env.PORT

const app = express()

const authServiceUrl = process.env.AUTH_SERVICE


app.use("/auth", proxy(authServiceUrl))

app.get("/", (req, res) => {
    //  res.send("Hello from the gateway server!")
    res.json({ message: "Hello from the gateway server!" })
})

app.listen(port, () => {
    console.log(`gateway server is running on port ${port}`)
})
