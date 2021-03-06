
const config = require("./utils/config")
const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const blogsRouter = require("./controllers/blogs")
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")
const middleware = require("./utils/middleware")
const mongoose = require("mongoose")
const cors = require("cors")

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then((success) => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message)
    process.exit(1)
  })

app.use(cors())
app.use(express.static("build"))
app.use(bodyParser.json())
app.use(middleware.tokenExtractor)

app.use("/api/blogs", blogsRouter)
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)

if (process.env.NODE_ENV === 'test') {  
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
  console.log('/api/testing enabled')
}

app.use(middleware.errorHandler)

module.exports = app
