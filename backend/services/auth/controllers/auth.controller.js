import { getAuth } from "firebase-admin/auth"
import crypto from "crypto"
import redis from "../../../shared/redis/redis.js"
import { app } from "../config/firebase.js"
import User from "../models/user.model.js"
import { createConnection } from "mongoose"

export const login = async (req, res) => {
    try {
        const { token } = req.body
        const decoded = await getAuth(app).verifyIdToken(token)
        let user = await User.findOne({
            firebaseUid: decoded.uid
        })

        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                name: decoded.displayName,
                email: decoded.email,
                avatar: decoded.picture
            })
        }

        const sessionId = crypto.randomUUID()
        // await redis.set(`user-session-${user?._id}`,
        //     sessionId
        //     , "EX", 7 * 24 * 60 * 60)
        await redis.set(`session-${sessionId}`, JSON.stringify({
            userId: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            // plan: user.plan,
            // credits: user.credits,
            // totalCredits: user.totalCredits,
            // planExpiresAt: user.planExpiresAt
        }), "EX", 7 * 24 * 60 * 60)


        res.cookie("session", sessionId, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({ message: `login error ${error}` })
    }
}

export const logOut = async (req, res) => {
    try {
        const sessionId = req.cookies?.session
        await redis.del(`session-${sessionId}`)

        res.clearCookie("session")
        return res.status(200).json({ message: "logout successfully" })
    } catch (error) {
        return res.status(500).json({ message: `logout error ${error}` })
    }
}

// 1. Read `session` cookie from the request
// 2. redis.get(`session-${sessionId}`)
// 3. Not found / expired -> 401 Unauthorized
// 4. Found -> JSON.parse it, attach as req.user, let the request continue