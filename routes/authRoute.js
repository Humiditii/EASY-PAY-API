const express = require('express');
const authController = require('../controller/auth');
//const { body } = require('express-validator/check');

const router = express.Router();

// GET api/register
router.get('/register', authController.getRegister);

//POST request to api/register to register a particular user/admin
router.post('/register', authController.postRegister);

//POST request to api/login to login a particular user/admkin
router.post('/login', authController.postSignin);   

//post request to api/resetPwd to reset passwords
router.post('/resetPwd', authController.postForgotPassword);

module.exports = router;