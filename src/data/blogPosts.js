import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const blogPostsRouter = express.Router()

const blogPostsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "blogPosts.json")
const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath))
const postBlogPost = (content) => fs.writeFileSync(blogPostsJSONPath, JSON.stringify(content))

blogPostsRouter.post('/', (req, res) => {
    const blogPostsArray = getBlogPosts()
    const newPost = { ...req.body, id: uuidv4(), createdAt: new Date() }
    blogPostsArray.push(newPost)
    postBlogPost(blogPostsArray)
})

blogPostsRouter.get('/', (req, res) => {
    const blogPostsArray = getBlogPosts()
    res.send(blogPostsArray)
})

blogPostsRouter.get('/:postId', (req, res) => {
    const blogPostsArray = getBlogPosts()
    const postFound = blogPostsArray.find(post => post.id === req.params.postId)
    res.send(postFound)
})

blogPostsRouter.put('/:postId', (req, res) => {
    const blogPostsArray = getBlogPosts()
    const postToEditIndex = blogPostsArray.findIndex(post => post.id === req.params.postId)
    const editedPost = { ...blogPostsArray[postToEditIndex], ...req.body, updatedAt: new Date() }
    blogPostsArray[postToEditIndex] = editedPost
    postBlogPost(blogPostsArray)
    res.send(editedPost)
})

blogPostsRouter.delete('/:postId', (req, res) => {
    const blogPostsArray = getBlogPosts()
    const remainingPostsArray = blogPostsArray.filter(post => post.id !== req.params.postId)
    postBlogPost(remainingPostsArray)
})














export default blogPostsRouter