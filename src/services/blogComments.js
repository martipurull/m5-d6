import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import createHttpError from 'http-errors'
import { getBlogPosts, postBlogPost } from '../library/fs-tools.js'

const blogCommentsRouter = express.Router({ mergeParams: true })

//endpoints
blogCommentsRouter.post('/', async (req, res, next) => {
    try {
        const blogPosts = await getBlogPosts()
        const currentBlogPostIndex = blogPosts.findIndex(post => post.id === req.params.postId)
        const newComment = { ...req.body, createdAt: new Date(), id: uuidv4() }
        if (blogPosts[currentBlogPostIndex].comments) {
            blogPosts[currentBlogPostIndex].comments.push(newComment)
        } else {
            blogPosts[currentBlogPostIndex].comments = []
            blogPosts[currentBlogPostIndex].comments.push(newComment)
        }
        await postBlogPost(blogPosts)
        res.status(201).send(`Comment added successfully to blog post with id ${ req.params.postId }`)
    } catch (error) {
        next(error)
    }
})

blogCommentsRouter.get('/', async (req, res, next) => {
    try {
        const blogPosts = await getBlogPosts()
        const currentBlogPost = blogPosts.find(post => post.id === req.params.postId)
        const blogPostComments = currentBlogPost.comments
        res.send(blogPostComments)
    } catch (error) {
        next(error)
    }
})

blogCommentsRouter.put('/:commentId', async (req, res, next) => {
    try {
        const blogposts = await getBlogPosts()
        const currentBlogPost = blogposts.find(blogpost => blogpost.id === req.params.postId)
        const commentToEditIndex = currentBlogPost.comments.findIndex(comment => comment.id === req.params.commentId)
        const editedComment = { ...currentBlogPost.comments[commentToEditIndex], ...req.body, updatedAt: new Date() }
        currentBlogPost.comments[commentToEditIndex] = editedComment
        await postBlogPost(blogposts)
        res.send(editedComment)
    } catch (error) {
        next(error)
    }

    blogCommentsRouter.delete('/:commentId', async (req, res, next) => {
        try {
            const blogposts = await getBlogPosts()
            const currentBlogPost = blogposts.find(blogpost => blogpost.id === req.params.postId)
            const remainingComments = currentBlogPost.comments.filter(comment => comment.id !== req.params.commentId)
            currentBlogPost.comments = remainingComments
            await postBlogPost(blogposts)
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    })
})



export default blogCommentsRouter