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

const port = process.env.PORT

//middleware
const publicFolderPath = join(process.cwd(), "./public")
server.use(express.static(publicFolderPath))

const whitelist = [process.env.FE_LOCAL_URL, process.env.FE_REMOTE_URL]
const corsOptions = {
    origin: function (origin, next) {
        console.log("CORS ORIGIN: ", origin)
        if (!origin || whitelist.indexOf(origin !== -1)) {
            next(null, true)
        } else {
            next(new Error("CORS ERROR!"))
        }
    }
}

server.use(cors(corsOptions))
server.use(express.json())

//endpoints
server.use('/authors', authorsRouter)
server.use('/authors/:authorId/uploadAvatar', authorAvatarsRouter)
server.use('/blogPosts', blogPostsRouter)
server.use('/blogPosts/:postId/comments', blogCommentsRouter)
server.use('/blogPosts/:postId/uploadCover', blogCoversRouter)

//error handlers
server.use(badRequestHandler)
server.use(unauthorisedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.table(listEndpoints(server))

server.listen(port, () => {
    console.log(`Server running on port ${ port }`)
})