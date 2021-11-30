import express from 'express'
import listEndpoints from 'express-list-endpoints'
import authorsRouter from './services/authors.js'
import cors from 'cors'

const server = express()

const port = 3001

server.use(express.json())

//endpoints follow

server.use('/authors', authorsRouter)


// console.table(listEndpoints(server))

server.listen(port, () => {
    console.log(`Server running on port: ${ port }`)
})