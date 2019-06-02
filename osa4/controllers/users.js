
const router = require("express").Router()
const bcrypt = require("bcryptjs")
const config = require("../utils/config")
const User = require("../models/user")

router.get("/", async (request, response, next) => {
    try {
        const users = await User.find({}).populate("blogs", { title: 1, author: 1, url: 1, likes: 1 })
        response.json(users.map(user => user.toJSON()))
    } catch (e) {
        next(e)
    }
})

router.post("/", async (request, response, next) => {
    try {
        const body = request.body

        if (body.password.length < 3) {
            return response.status(400).json({ error: "password must be at least 3 characters" })
        }

        const passwordHash = await bcrypt.hash(body.password, config.BCRYPT_ROUNDS)

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash: passwordHash,
        })

        const savedUser = await user.save()

        response.json(savedUser)
    } catch (e) {
        next(e)
    }
})

module.exports = router
