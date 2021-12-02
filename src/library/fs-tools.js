import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'


const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")

const blogPostsJSONPath = join(dataFolderPath, "blogPosts.json")
const authorsJSONPath = join(dataFolderPath, "authors.json")
const blogCommentsJSONPath = join(dataFolderPath, "blogComments.json")

export const getBlogPosts = () => readJSON(blogPostsJSONPath)
export const getAuthors = () => readJSON(authorsJSONPath)
export const getBlogComments = () => readJSON(blogCommentsJSONPath)
export const postBlogPost = (content) => writeJSON(blogPostsJSONPath, content)
export const createAuthors = (content) => writeJSON(authorsJSONPath, content)
export const postBlogComment = (content) => writeJSON(blogCommentsJSONPath, content)