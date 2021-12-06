import express from 'express'
import multer from 'multer'
import createHttpError from 'http-errors'
import { getAuthors, createAuthors, saveAuthorAvatar } from '../library/fs-tools.js'
import path from 'path'
import cloudinary from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

const authorAvatarsRouter = express.Router({ mergeParams: true })

// const avatarUploader = multer({
//     fileFilter: (req, file, multerNext) => {
//         if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/gif" && file.mimetype !== "image/png") {
//             multerNext(createHttpError(400, "File type not supported: please try with a jpeg, gif or png."))
//         } else if (file.size > 3000000) {
//             multerNext(createHttpError(400, "The image is too large: please upload an image under 3MB."))
//         } else {
//             multerNext(null, true)
//         }
//     }
// }).single("authorAvatar")

const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "strive-blog"
    }
})

const avatarUploader = multer({ storage: cloudStorage }).single("authorAvatar")

authorAvatarsRouter.post('/', avatarUploader, async (req, res, next) => {
    console.log(req.params)
    try {
        const authors = await getAuthors()
        const currentAuthor = authors.find(author => author.id === req.params.authorId)
        const fileName = `${ req.params.authorId }.${ path.extname(req.file.originalname) }`
        console.log("FILE NAME: ", fileName)
        await saveAuthorAvatar(fileName, req.file.buffer)
        currentAuthor.avatar = `https://res.cloudinary.com/dpyfjvq8s/image/upload/v1638806215/strive-blog/${ fileName }`
        authors.push(currentAuthor)
        await createAuthors(authors)
        res.send("New avatar image uploaded.")
    } catch (error) {
        next(error)
    }
})











export default authorAvatarsRouter