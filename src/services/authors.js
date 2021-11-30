import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const authorsRouter = express.Router()

//authors path (in local computer)

const currentFilePath = fileURLToPath(import.meta.url)

const currentFolderPath = dirname(currentFilePath)

const authorsJSONPath = join(currentFolderPath, "authors.json")

//create endpoints

//create new author and check if email is taken
authorsRouter.post('/', (req, res) => {
    const checkEmail = () => {
        //get the array of authors, parsed to json
        const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))
        const isEmailTaken = authorsArray.find(author => author.email === req.body.email)
        return isEmailTaken
    }
    if (!checkEmail()) {
        //create newAuthor template with server generated properties
        const newAuthor = { ...req.body, createdAt: new Date(), updatedAt: new Date(), id: uuidv4() }
        //call the array of authors from local folder and parse it to jason
        const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
        //add newAuthor object to authors array
        authors.push(newAuthor)
        //write the new array into the saved file (including newAuthor on top of all previous authors)
        fs.writeFileSync(authorsJSONPath, JSON.stringify(authors))
        //send back the id of the newly created author plus the success status code (201 for data creation)
        res.status(201).send(`new author created with id ${ newAuthor.id } on ${ newAuthor.createdAt }`)
    } else {
        res.status(409).send(`Your request could not be processed: ${ req.body.email } is already in use by another author.`)
    }
})

//read array of authors
authorsRouter.get('/', (req, res) => {
    //get the contents of the json file
    const fileContent = fs.readFileSync(authorsJSONPath)
    //parse it to json so it can be humanly read
    const authorsArray = JSON.parse(fileContent)
    //send back the array
    res.send(authorsArray)
})

//read single author
authorsRouter.get('/:authorId', (req, res) => {
    //get the array of authors, parsed to json
    const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))
    //find the single author according to params
    const authorFound = authorsArray.find(a => a.id === req.params.authorId)

    res.send(authorFound)
})

//update single author
authorsRouter.put('/:authorId', (req, res) => {
    //get the array of authors, parsed to json
    const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))
    //find the index of the author whose details we want to edit
    const authorIndex = authorsArray.findIndex(a => a.id === req.params.authorId)
    //edit the author details overwriting the details provided in the req.body
    const editedAuthor = { ...authorsArray[authorIndex], ...req.body }
    //replace author we wanted to edit with the newly edited author 
    authorsArray[authorIndex] = editedAuthor
    //save the new array with the replaced author in the file
    fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray))
    //send back the updated author as a proper response
    res.send(editedAuthor)
})

//delete single author
authorsRouter.delete('/:authorId', (req, res) => {
    //get array of authors, parse it to json
    const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))
    //filter out the author indicated on req.params and create new array without them
    const authorsLeft = authorsArray.filter(a => a.id !== req.params.authorId)
    //write new array onto json file
    fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsLeft))
    //send back response for empty content
    res.status(204).send()
})






export default authorsRouter