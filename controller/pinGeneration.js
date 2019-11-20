const crypto = require('crypto');
const User = require('../models/authModel');
const Pin = require('../models/pinGenModel');
exports.getGenPin = ( req, res, next) => {

    const userId = req.userId;

    User.findById(userId).then( user => {
        if (user.role !== 'Admin') {
            res.status(401).send({
                message: 'Invalid role'
            });
        } else {
            const userName = user.name;
            const role = user.role;

            res.status(200).send({
                message: {
                    name: userName,
                    roleLog: role
                }
            });
        }
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.postPin = (req, res, next ) => {
    const reqName = req.body.name;
    const pinToGenerate = crypto.randomBytes(7).toString('hex');
    const creator = req.userId;

    const newPinDataEntry = new Pin({
        name: reqName,
        pin: pinToGenerate,
        status: 0,
        adminId: creator
    });

    return newPinDataEntry.save().then( result => {
        console.log(result);
        const creatorId = result.adminId;
        User.findById(creatorId).then( creator => {
            const creatorName = creator.name;
            res.status(201).send({
                response: {
                    message: 'Pin generated',
                    pin: result.pin,
                    nameOfOwner: result.name,
                    nameOfAdmin: creatorName
                }
            });
        }).catch( err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
    }).catch( err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}


exports.viewPins = (req, res, next) => {
    const creatorId = req.userId;

    Pin.find({adminId: creatorId}).then( results => {
        console.log(results);
        res.json({
            response: results
        });
    });
}