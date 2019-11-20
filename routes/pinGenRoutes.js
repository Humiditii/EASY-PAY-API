const express = require('express');
const pinGen = require('../controller/pinGeneration');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

//GET request to /pingenerate
router.get('/pingenerate', isAuth,  pinGen.getGenPin);

//post request to /api/pingenerate
router.post('/pingenerate', isAuth, pinGen.postPin);

// GET request /api/viewPins to get all generated pins by a particular admin
router.get('/viewPins', isAuth, pinGen.viewPins);
module.exports = router;