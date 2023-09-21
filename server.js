// load env variables
if (process.env.NODE_ENV != 'production') {
    require("dotenv").config();
}

//import dependencies
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectToDb } = require('./config/connectToDb');
const notesController = require('./controllers/notes.controller')
const usersController = require('./controllers/users.controller')
const { requireAuth } = require('./middleware/requireAuth');

//create an express app
const app = express();

// configure middleware
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
}));

// connect to database
connectToDb();

//routing
app.get('/', (req, res) => {
    res.json({ hello: "World" });
});

app.post('/signup', usersController.signup)
app.post('/login', usersController.login)
app.get('/logout', usersController.logout)
app.get('/check-auth', requireAuth, usersController.checkAuth)

app.get('/notes', requireAuth, notesController.fetchNotes);
app.get('/notes/:id', requireAuth, notesController.fetchNote);
app.post('/notes', requireAuth, notesController.createNote);
app.put('/notes/:id', requireAuth, notesController.updateNote);
app.delete('/notes/:id', requireAuth, notesController.deleteNote);

// start server
app.listen(process.env.PORT);