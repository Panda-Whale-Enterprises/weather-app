//server/server.js
const path = require('path');
const express = require('express');
//const axios = require('axios');
//const coreJsCompat = require('@babel/preset-env/data/core-js-compat');

// Connects to database
require('./model').connectToDB();

const controller = require('./controllers/controller');

const cors = require('cors');
//const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
//const session = require('express-session');
const userController = require('./controllers/userController');
const cookieController = require('./controllers/cookieController');
//const sessionController = require('./controllers/sessionController');

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// mongoose.connect(`mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@cluster0.txufs6f.mongodb.net/?retryWrites=true&w=majority`, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     dbName: 'weatherApp'
// })
//     .then(() => console.log('Connected to Mongo DB.'))
//     .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../index.html'))
})

const router = express.Router();
app.use('/', router);

// Get monthly weather data for a city
// http://localhost:3000/search
router.post('/search', 
  controller.getData, 
  controller.getCoordinates, 
  controller.getStations, 
  controller.getMonthlyData, 
  controller.saveData,
  (req, res, next) => {
      res.status(200).send({cityName: res.locals.cityName, cityData: res.locals.cityData});
});


//SIGNUP routes
router.post('/signup', userController.createUser, cookieController.setSSIDCookie, (req, res, err) => {
    console.log('signup successful')
    res.status(200).send(res.locals.isLoggedIn); // redirect is already handled on frontend
})

//LOGIN routes
router.post('/login', userController.verifyUser, cookieController.setSSIDCookie, (req, res, err) => {
    console.log('login successful')
    res.status(200).send(res.locals.isLoggedIn); // frontend will handle redirect to homepage
})

//AUTHORIZED routes
app.get('/favorites', (req, res) => {

})

app.get('/favorites/users', userController.getAllUsers, (req, res) => {
    res.send({users: res.locals.users});
})

//404 Handler
app.use('*', (req, res) => {
    res.status(404).send('Not Found');
});

//Global Error Handler
app.use((err, req, res, next) => {
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 500,
      message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    res.status(errorObj.status).json(errorObj.message.err);
  });


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});

module.exports = app;