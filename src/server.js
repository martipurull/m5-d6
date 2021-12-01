import express from 'express'
import listEndpoints from 'express-list-endpoints'
import authorsRouter from './services/authors.js'
import blogPostsRouter from './data/blogPosts.js'
import cors from 'cors'

const server = express()

const port = 3001

server.use(cors()) //we need this to connect front end with back end --> more on this next week
server.use(express.json())

//endpoints follow

server.use('/authors', authorsRouter)
server.use('/blogPosts', blogPostsRouter)


console.table(listEndpoints(server))

server.listen(port, () => {
    console.log(`Server running on port: ${ port }`)
})