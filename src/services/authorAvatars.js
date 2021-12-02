import express from 'express'
import multer from 'multer'
import createHttpError from 'http-errors'
import { getAuthors, createAuthors, saveAuthorAvatar } from '../library/fs-tools.js'

const authorAvatarsRouter = express.Router()

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
    try {
        const authors = await getAuthors()
        const currentAuthor = authors.find(author => author.id === req.params.id)
        const fileName = `${ req.params.authorId }.${ req.file.mimetype.slice(6) }`
    } catch (error) {
        next(error)
    }
})









export default authorAvatarsRouter