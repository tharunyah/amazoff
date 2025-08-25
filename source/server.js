import express from 'express'
import path from 'path'
import  { dirname } from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config';
import sequelize from './db.js'
import authRoutes from './routes/auth.js'

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

//authentication routes for any requests to /api/auth
app.use('/api/auth', authRoutes);



const startServer = async () => {
  try {
    // This creates the tables if they don't exist
    await sequelize.sync();
    console.log('Database synced successfully.');
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();