const listHelper = require("../utils/list_helper")

test("dummy returns one", () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

const listWithOneBlog = [
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    }
]

const listWithBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    }
]

describe("total likes", () => {
    test("when list has only one blog equals the likes of that", () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })

    test("when list has many blogs equals the sum of likes", () => {
        const result = listHelper.totalLikes(listWithBlogs)
        expect(result).toBe(7 + 5 + 12)
    })
})

describe("favorite blog", () => {
    test("when list has only one blog equals it", () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        expect(result).toEqual(listWithOneBlog[0])
    })

    test("when list has many blogs equals the one with most likes", () => {
        const result = listHelper.favoriteBlog(listWithBlogs)
        expect(result.likes).toBe(12)
    })
})

describe("most blogs", () => {
    test("when list has only one blog equals its author", () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        expect(result.author).toEqual(listWithOneBlog[0].author)
        expect(result.blogs).toEqual(1)
    })

    test("when list has many blogs equals the author with most blogs", () => {
        const result = listHelper.mostBlogs(listWithBlogs)
        expect(result.author).toEqual("Edsger W. Dijkstra")
        expect(result.blogs).toEqual(2)
    })
})

describe("most likes", () => {
    test("when list has only one blog equals its author", () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        expect(result.author).toEqual(listWithOneBlog[0].author)
        expect(result.likes).toEqual(5)
    })

    test("when list has many blogs equals the author with most likes", () => {
        const result = listHelper.mostLikes(listWithBlogs)
        expect(result.author).toEqual("Edsger W. Dijkstra")
        expect(result.likes).toEqual(17)
    })
})



