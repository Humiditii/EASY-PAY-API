const express = require('express');
const homeController = require('../controller/home');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

//GET request to the user's home page
router.get('/home', isAuth, homeController.viewHome);

module.exports = router;