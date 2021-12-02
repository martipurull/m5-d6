import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { validationResult } from 'express-validator'
import { blogPostsValidation } from './blogPostValidation.js'
import createHttpError from 'http-errors'
import striptags from 'striptags'
import { getBlogPosts, postBlogPost } from '../library/fs-tools.js'

const blogPostsRouter = express.Router()

//endpoints
blogPostsRouter.post('/', blogPostsValidation, async (req, res, next) => {
    try {
        const errorList = validationResult(req)
        if (!errorList.isEmpty()) {
            next(createHttpError(400, "There some errors on your submission, namely: ", { errorList }))
        } else {
            const blogPostsArray = await getBlogPosts()
            const strippedPostContent = striptags(req.body.content)
            const newPostReadTime = Math.ceil(strippedPostContent.split(' ').length / 250)
            const newPost = { ...req.body, id: uuidv4(), createdAt: new Date(), readTime: { value: newPostReadTime, unit: newPostReadTime > 1 ? "minutes" : "minute" } }
            blogPostsArray.push(newPost)
            postBlogPost(blogPostsArray)
            res.status(201).send({ id: newPost.id })
        }
    } catch (error) {
        next(error)
    }
})

blogPostsRouter.get('/', async (req, res, next) => {
    try {
        const blogPostsArray = await getBlogPosts()
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

blogPostsRouter.get('/:postId', async (req, res, next) => {
    try {
        const blogPostsArray = await getBlogPosts()
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

blogPostsRouter.put('/:postId', async (req, res, next) => {
    try {
        const blogPostsArray = await getBlogPosts()
        const postToEditIndex = blogPostsArray.findIndex(post => post.id === req.params.postId)
        const editedPost = { ...blogPostsArray[postToEditIndex], ...req.body, updatedAt: new Date() }
        blogPostsArray[postToEditIndex] = editedPost
        await postBlogPost(blogPostsArray)
        res.send(editedPost)
    } catch (error) {
        next(error)
    }
})

blogPostsRouter.delete('/:postId', async (req, res, next) => {
    try {
        const blogPostsArray = await getBlogPosts()
        const remainingPostsArray = blogPostsArray.filter(post => post.id !== req.params.postId)
        await postBlogPost(remainingPostsArray)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})



export default blogPostsRouter