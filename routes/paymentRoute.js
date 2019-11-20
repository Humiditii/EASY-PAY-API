const express = require('express');
const paymentController = require('../controller/payment');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

//GET route to api/payment
router.get('/payment', isAuth, paymentController.getPayment);

//POST request to api/payment
router.post('/payment', isAuth, paymentController.postPayment);

module.exports = router;