const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');
const User = require('../models/authModel');
const jwt = require('jsonwebtoken');
const Pin = require('../models/pinGenModel');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

exports.getRegister = ( req, res, next) => {
    res.json({
        message: 'Welcome to the registration page'
    });
}

exports.postRegister = (req, res, next) => {
    const reqName = req.body.name;
    const reqEmail = req.body.email;
    const reqPhone = req.body.phone;
    const reqRole = req.body.role;
    const reqPassword = req.body.password;

    //check for existing Email
    User.findOne({
        email: reqEmail
    }).then( foundResult => {
        if (foundResult) {
            let err = 'Email is already used';
            return res.status(400).json({
                message: err
            });
        } else{

            //check the type of user to register admin/users
            if (reqRole === 'Admin') {

                return bycrypt.hash(reqPassword, 12).then( hashedPassword => {
                    const adminPin = 'Admin';
                    
                    // passing all request data to an instance of the User model
                    const signUpAdmin = new User({
                        name: reqName,
                        email: reqEmail,
                        phone: reqPhone,
                        role: reqRole,
                        pin: adminPin,
                        password: hashedPassword
                    });

                    return signUpAdmin.save().then( result => {
                        res.status(201).json({
                            message: 'Admin signup Successfully',
                            data: result
                        });
                    }).catch( err => {
                        if (!err.statusCode) {
                            err.statusCode = 500;
                        }
                        next(err);
                    })
                }).catch( err => {
                    if(!err.statusCode){
                        err.statusCode = 500;
                    }
                    next(err);
                })
                
            } else if ( reqRole === 'User'){
                const reqPin = req.body.pin;

                //Confirm PIN input by the client if pin exist
                Pin.findOne({pin: reqPin}).then( foundPin => {
                    let pinName= foundPin.name;
                    const pinPin = foundPin.pin;
                    let pinStatus = foundPin.status;
                    const pinAdminId = foundPin.adminId;
                    if (!foundPin) {
                        const err = 'Invalid pin inputed'
                        res.status(404).json({
                            message: err
                        });
                        
                        //check if the pin has already been used 
                    } else if (pinStatus === 1) {
                        const err = 'Pin used by another user'
                        res.status(400).json({
                            message: err
                        });
                        // Check if the pin has not been used then sign up the user
                    } else if (pinStatus === 0) {
                        return bycrypt.hash(reqPassword, 12).then(hashedPassword => {
                            
                            const userPin = reqPin;

                            const signUpUser = new User({
                                name: reqName,
                                email: reqEmail,
                                phone: reqPhone,
                                role: reqRole,
                                pin: userPin,
                                adminId: pinAdminId,
                                password: hashedPassword
                            });

                            // updating data in the PinGen model 
                            foundPin.name = reqName;
                            foundPin.pin = foundPin.pin;
                            foundPin.status = 1;
                            foundPin.adminId = foundPin.adminId;
                            return foundPin.save().then( result => {
                                signUpUser.save().then( savedUser=> {
                                    res.status(201).json({
                                        message: 'User signed up successfully',
                                        data: savedUser
                                    });
                                }).catch( err => {
                                    if (!err.statusCode) {
                                        err.statusCode = 500;
                                    }
                                    next(err);
                                })
                            }).catch( err => {
                                if (!err.statusCode) {
                                    err.statusCode = 500;
                                }
                                next(err);
                            })

                        }).catch(err => {
                            if (!err.statusCode) {
                                err.statusCode = 500;
                            }
                            next(err);
                        })
                    }
                }).catch( err => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                });
            }
        }
    }).catch( err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });

}


exports.postSignin = (req, res, next ) => {
    const reqEmail = req.body.email;
    const password = req.body.password;
    
    //Checking for Email if it exist
    User.findOne({ email: reqEmail}).then( searchedUser => {
        // console.log(searchedUser);
        if (!searchedUser) {
            let err = 'User data cant be found incorrect Email';
            return res.status(400).json({
                message: err
            });
            // If Email exist
        } else if (searchedUser) {

            //Check for password match
            return bycrypt.compare(password, searchedUser.password).then( booleanResult =>{
                if (!booleanResult) {
                    let err = 'User Found but incorrect password';
                    res.status(401).json( { message: err } );
                    //if password match then sign in user
                } else {
                    // Encrypting JWT token
                    const token = jwt.sign({ email: searchedUser.email, userId: searchedUser._id.toString(), userRole: searchedUser.role }, 
                        'easypayapisupersecrete', { expiresIn: '1h'} );
                    res.status(200).json( {
                            Message: searchedUser.name +" "+ "logged in",
                            token: token,
                            userId: searchedUser._id.toString(),
                            userRole: searchedUser.role
                        }
                    );
                }
            }).catch( err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
        } 
    }).catch( err => {
         if (!err.statusCode) {
             err.statusCode = 500;
         }
         next(err);
    });
    
}

exports.postForgotPassword = ( req, res, next) => {

    const reqEmail = req.body.email;

    User.findOne({ email: reqEmail}).then( foundDocument => {

        if (!foundDocument) {
            res.status(404).json({
                message: 'User Not Found'
            });     
        }else{
             const userObject = foundDocument;
             const newPwd = crypto.randomBytes(16).toString("hex");
             bycrypt.hash( newPwd, 12).then(hashed => {
               userObject.updateOne({
                   password: hashed
               }).then( result => {
                   console.log(result);
                    res.status(200).json({
                        message: result
                    });
               }).catch( err=> {
                   if (!err.statusCode) {
                       err.statusCode = 500;
                   }
               });
             }).catch( err=> {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
             });
            //  console.log(userObject.password);
        }

    }).catch( err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });


}