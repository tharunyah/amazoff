import express from 'express'
import path from 'path'
import  { dirname } from 'path'
import { fileURLToPath } from 'url'

const app = express()
const PORT = process.env.PORT || 8383;

//middleware to handle json
app.use(express.json())

//get the file path
const __filename = fileURLToPath(import.meta.url)
const __dirname =  dirname(__filename)

//redirecting the filename command to the right directory
app.use(express.static(path.join(__dirname, '../static')))

//endpoint to serve home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../static/index.html'))
})

//endpoint to serve login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../static/log-in.html'))
})

//endpoint to serve signup page
app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, '../static/signin.html'))
})

app.listen(PORT, () => {
    console.log("The server has started ");
})