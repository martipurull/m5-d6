import express from 'express'
import listEndpoints from 'express-list-endpoints'
import authorsRouter from './services/authors.js'
import blogPostsRouter from './services/blogPosts.js'
import blogCommentsRouter from './services/blogComments.js'
import blogCoversRouter from './services/blogCovers.js'
import authorAvatarsRouter from './services/authorAvatars.js'
import cors from 'cors'
import { badRequestHandler, unauthorisedHandler, notFoundHandler, genericErrorHandler } from './errorHandlers.js'
import { join } from 'path'

const server = express()

const port = 3001

const publicFolderPath = join(process.cwd(), "./public")
//middleware
server.use(express.static(publicFolderPath))
server.use(cors()) //we need this to connect front end with back end --> more on this next week
server.use(express.json())

//endpoints
server.use('/authors', authorsRouter)
server.use('/blogPosts', blogPostsRouter)
server.use('/blogPosts/:postId/comments', blogCommentsRouter)
server.use('/blogPosts/:postId/uploadCover', blogCoversRouter)
server.use('/authors/:authorId/uploadAvatar', authorAvatarsRouter)

//error handlers
server.use(badRequestHandler)
server.use(unauthorisedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.table(listEndpoints(server))

server.listen(port, () => {
    console.log(`Server running on port: ${ port }`)
})