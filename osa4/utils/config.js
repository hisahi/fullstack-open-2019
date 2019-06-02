require("dotenv").config()

let PORT = process.env.PORT || 3303
let MONGODB_URI = process.env.MONGODB_URI
let BCRYPT_ROUNDS = +(process.env.BCRYPT_ROUNDS || 10)
let TOKEN_SECRET = process.env.TOKEN_SECRET

if (process.env.NODE_ENV === "test") {
    MONGODB_URI = process.env.TEST_MONGODB_URI
}

module.exports = {
    MONGODB_URI,
    PORT,
    BCRYPT_ROUNDS,
    TOKEN_SECRET
}