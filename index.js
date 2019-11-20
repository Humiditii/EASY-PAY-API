const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoute');
const pinGenRoutes = require('./routes/pinGenRoutes');
const paymentRoutes = require('./routes/paymentRoute');
const homeRoutes = require ('./routes/homeRoute');
const detailRoutes = require('./routes/detailsRoute');


// for form data
   app.use(bodyParser.urlencoded({
       extended: false
   }));

// application/json parsing json incoming request

//app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Passing the Application routes to the Express Middleware
app.use('/api', authRoutes);
app.use('/api', pinGenRoutes);
app.use('/api', paymentRoutes);
app.use('/api', homeRoutes);
app.use('/api', detailRoutes);
//Route Ends


app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;

    res.status(status).json({
        message: message
    });
});

const port = 3000;

const MONGO_URI = 'mongodb://localhost:27017/easy_save_api';
mongoose.connect(MONGO_URI, {
        useNewUrlParser: true
    }).then(connection => {
    app.listen(port, () => {
        console.log('Server running at ' + port);
    });
}).catch(err => {
    throw err;
    //console.log(err);   
});
