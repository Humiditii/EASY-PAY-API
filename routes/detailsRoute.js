const express = require('express');

//Authentication Middleware module
const isAuth = require('../middleware/is-auth');
const detailController = require('../controller/details');

const router = express.Router();

//GET request to details to get sent transactions
router.get('/details', isAuth, detailController.getDetails);

//GET request to received to get received transactions
router.get('/received', isAuth, detailController.getReceivedDetails);

//PUT request to update the status of a particular transaction
router.put('/received/:editId', isAuth, detailController.updateStatus);



module.exports = router;