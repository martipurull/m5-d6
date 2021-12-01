import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { validationResult } from 'express-validator'
import { blogPostsValidation } from './blogPostValidation.js'
import createHttpError from 'http-errors'



const blogPostsRouter = express.Router()

const blogPostsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "blogPosts.json")
const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath))
const postBlogPost = (content) => fs.writeFileSync(blogPostsJSONPath, JSON.stringify(content))

blogPostsRouter.post('/', blogPostsValidation, (req, res, next) => {
    try {
        const errorList = validationResult(req)
        if (!errorList.isEmpty()) {
            next(createHttpError(400, "There some errors on your submission, namely: ", { errorList }))
        } else {
            const blogPostsArray = getBlogPosts()
            const newPostReadTime = Math.ceil(req.body.content.length / 250)
            const newPost = { ...req.body, id: uuidv4(), createdAt: new Date(), readTime: { value: newPostReadTime, unit: newPostReadTime > 1 ? "minutes" : "minute" } }
            blogPostsArray.push(newPost)
            postBlogPost(blogPostsArray)
            res.status(201).send({ id: newPost.id })
        }
    } catch (error) {
        next(error)
    }
})

blogPostsRouter.get('/', (req, res, next) => {
    try {
        const blogPostsArray = getBlogPosts()
        if (req.query && req.query.title) {
            const filteredPosts = blogPostsArray.filter(post => post.title.includes(req.query.title))
            res.send(filteredPosts)
        } else {
            res.send(blogPostsArray)
        }
        res.send(blogPostsArray)
    } catch (error) {
        next(error)
    }
})

blogPostsRouter.get('/:postId', (req, res, next) => {
    try {
        const blogPostsArray = getBlogPosts()
        const postFound = blogPostsArray.find(post => post.id === req.params.postId)
        if (postFound) {
            res.send(postFound)
        } else {
            next(createHttpError(404, `Blog post with id ${ req.params.postId } does not exist or has been deleted.`))
        }
    } catch (error) {
        next(error)
    }
})

blogPostsRouter.put('/:postId', (req, res, next) => {
    try {
        const blogPostsArray = getBlogPosts()
        const postToEditIndex = blogPostsArray.findIndex(post => post.id === req.params.postId)
        const editedPost = { ...blogPostsArray[postToEditIndex], ...req.body, updatedAt: new Date() }
        blogPostsArray[postToEditIndex] = editedPost
        postBlogPost(blogPostsArray)
        res.send(editedPost)
    } catch (error) {
        next(error)
    }
})

blogPostsRouter.delete('/:postId', (req, res, next) => {
    try {
        const blogPostsArray = getBlogPosts()
        const remainingPostsArray = blogPostsArray.filter(post => post.id !== req.params.postId)
        postBlogPost(remainingPostsArray)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})



export default blogPostsRouter