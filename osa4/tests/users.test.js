const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const User = require("../models/user")
const assert = require("assert")

describe("when creating users", () => {
    beforeEach(async () => {
        await User.deleteMany({})

        await new User({
            username: "testname",
            passwordHash: "$2a$10$TxlHLlrzGd9QA.qSQHHHtOx7ZJFVgeZXy3etXoGVV10KpXXu.9SBO"
        }).save()
    })

    test("users with non-unique usernames cannot be created", async () => {
        await api
            .post("/api/users")
            .send({
                username: "testname",
                password: "password2"
            })
            .expect(400)
    })

    test("users with too short usernames cannot be created", async () => {
        await api
            .post("/api/users")
            .send({
                username: "t",
                password: "password2"
            })
            .expect(400)
    })

    test("users with too short passwords cannot be created", async () => {
        await api
            .post("/api/users")
            .send({
                username: "testuser",
                password: "p"
            })
            .expect(400)
    })
})

afterAll(() => {
    mongoose.connection.close()
})
