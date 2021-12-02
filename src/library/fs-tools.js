import { readJSON, writeJSON } from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'


const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")

const blogPostsJSONPath = join(dataFolderPath, "blogPosts.json")
const authorsJSONPath = join(dataFolderPath, "authors.json")

export const getBlogPosts = () => readJSON(blogPostsJSONPath)
export const getAuthors = () => readJSON(authorsJSONPath)
export const postBlogPost = (content) => writeJSON(blogPostsJSONPath, content)
export const createAuthors = (content) => writeJSON(authorsJSONPath, content)