import express from 'express'
import multer from 'multer'
import createHttpError from 'http-errors'
import { getAuthors, createAuthors, saveAuthorAvatar } from '../library/fs-tools.js'
import path from 'path'

const authorAvatarsRouter = express.Router({ mergeParams: true })

const avatarUploader = multer({
    fileFilter: (req, file, multerNext) => {
        if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/gif" && file.mimetype !== "image/png") {
            multerNext(createHttpError(400, "File type not supported: please try with a jpeg, gif or png."))
        } else if (file.size > 3000000) {
            multerNext(createHttpError(400, "The image is too large: please upload an image under 3MB."))
        } else {
            multerNext(null, true)
        }
    }
}).single("authorAvatar")

authorAvatarsRouter.post('/', avatarUploader, async (req, res, next) => {
    console.log(req.params)
    try {
        const authors = await getAuthors()
        const currentAuthor = authors.find(author => author.id === req.params.authorId)
        const fileName = `${ req.params.authorId }.${ path.extname(req.file.originalname) }`
        console.log("FILE NAME: ", fileName)
        await saveAuthorAvatar(fileName, req.file.buffer)
        currentAuthor.avatar = `http://localhost:3001/author-avatars/${ fileName }`
        authors.push(currentAuthor)
        await createAuthors(authors)
        res.send("New avatar image uploaded.")
    } catch (error) {
        next(error)
    }
})









export default authorAvatarsRouter