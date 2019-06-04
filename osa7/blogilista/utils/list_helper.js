
const unique = require("array-unique")

const dummy = (blogs) => 1

const totalLikes = (blogs) => (
    blogs
        .reduce((existing, blog) => existing + blog.likes, 0)
)

const favoriteBlog = (blogs) => (
    blogs
        .reduce((current, blog) =>
        // if current is none or current one has more likes than the other...
            current !== null && current.likes > blog.likes ? current : blog,
        null)
)

const mostBlogs = (blogs) => (
    blogs
        .map(blog => blog.author)
        .map((author, _, array) => ({ author: author,
            blogs: array.filter(x => x === author).length }))
        .reduce((current, author) =>
            current !== null && current.blogs > author.blogs ? current : author,
        null)
)

const mostLikes = (blogs) => (
    unique(blogs
        .map(blog => blog.author))
        .map((author, _, array) => ({ author: author,
            likes: blogs
                .filter(blog => blog.author === author)
                .reduce((existing, blog) => existing + blog.likes, 0) }))
        .reduce((current, author) =>
            current !== null && current.likes > author.likes ? current : author,
        null)
)

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
