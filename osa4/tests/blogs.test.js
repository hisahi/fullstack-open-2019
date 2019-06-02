const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const Blog = require("../models/blog")
const assert = require("assert")

const dataBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
    },
    {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5
    },
    {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12
    },
    {
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10
    },
    {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0
    },
    {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2
    }
]

describe("when there are initially some blogs saved", () => {
    beforeEach(async () => {
        await Blog.deleteMany({})

        for (let blog of dataBlogs) {
            await new Blog(blog).save()
        }
    })

    describe("getting blogs", () => {
        test("blogs are returned as json", async () => {
            const resultApi = await api
                .get("/api/blogs")
                .expect(200)
                .expect("Content-Type", /application\/json/)
            const resultBlogs = resultApi.body

            expect(resultBlogs.length).toEqual(dataBlogs.length)
        })

        test("blogs have an id field", async () => {
            const resultApi = await api.get("/api/blogs").expect(200)
            const resultBlogs = resultApi.body

            expect(resultBlogs[0].id).toBeDefined()
        })
    })

    describe("posting blogs", () => {
        test("blogs can be posted", async () => {
            await api
                .post("/api/blogs")
                .send({
                    title: "Test blog",
                    author: "filler",
                    url: "http://example.com/",
                    likes: 5
                })
                .expect(201)
                .expect("Content-Type", /application\/json/)

            const resultApi = await api.get("/api/blogs").expect(200)
            const resultBlogs = resultApi.body

            expect(resultBlogs.length).toEqual(1 + dataBlogs.length)
        })

        test("blogs can be posted without likes", async () => {
            const apiResponse = await api
                .post("/api/blogs")
                .send({
                    title: "Test blog",
                    author: "filler",
                    url: "http://example.com/"
                })
                .expect(201)
                .expect("Content-Type", /application\/json/)

            expect(apiResponse.body.likes).toEqual(0)
        })

        test("blogs cannot be posted without title or url", async () => {
            const apiResponse = await api
                .post("/api/blogs")
                .send({
                    author: "test"
                })
                .expect(400)
        })
    })

    describe("deleting blogs", () => {
        test("blogs can be deleted", async () => {
            const resultApi = await api.get("/api/blogs").expect(200)
            const resultBlogs = resultApi.body
            const firstId = resultBlogs[0].id

            await api
                .delete(`/api/blogs/${firstId}`)
                .expect(204)

            const resultApiNew = await api.get("/api/blogs").expect(200)
            const resultBlogsNew = resultApiNew.body

            expect(resultBlogsNew.length).toEqual(resultBlogs.length - 1)
        })
    })

    describe("editing blogs", () => {
        test("blogs can be edited", async () => {
            const resultApi = await api.get("/api/blogs").expect(200)
            const resultBlogs = resultApi.body
            const firstId = resultBlogs[0].id
            const newBlog = await api
                .put(`/api/blogs/${firstId}`)
                .send({ ...resultBlogs[0], likes: 39 })
                .expect(200)
                .expect("Content-Type", /application\/json/)

            expect(newBlog.body.likes).toEqual(39)
        })
    })
})

afterAll(() => {
    mongoose.connection.close()
})
