const User = require('../models/authModel');
const Payment = require('../models/paymentModel');
const prop = require('../middleware/populate');
const dateMod = require('../middleware/date');
const AdminPay = require('../models/adminPaymentModel');


 const currentDate = new Date();
 const reqMonth = currentDate.getMonth();
exports.getDetails = ( req, res, next) => {
    const userRole = req.userRole;
    const userId = req.userId;

    // Trying to get the current month
   

    if (userRole === 'Admin') {
        
        AdminPay.find({
            adminId: userId
        }).where({month: reqMonth}).then( result => {
            console.log(result);
            if (result.length < 1) {
                return res.status(204).json({
                    message: 'No data'
                });
            }
            return res.status(200).json({
                message: prop.adminDetails(result)
            });
            
            
        }).catch( err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

    } else if (userRole === 'User') {
          Payment.find({
                  depositorId:userId
              }).then(result => {
              if (result.length < 1 ) {
                 return res.status(404).json({
                    message: 'No data'
                 });
              }
              res.status(200).json({
                message: prop.userDetails(result)
              })
              
          }).catch(err => {
              if (err.ststusCode) {
                  err.statusCode = 500;
              }
              next(err);
          })
    }
    
}


exports.getReceivedDetails = (req, res, next) => {

    const userRole = req.userRole;
    const userId = req.userId;

    if (userRole === 'User') {
        
        AdminPay.find({
            receiverId: userId
        }).where({
            month: reqMonth
        }).then( userDocuments => {
            if (userDocuments.length < 1) {
                return res.status(404).json({
                    message: 'No Data found',
                });
            }
            else{
                return res.status(200).json({
                    message: prop.adminDetails(userDocuments),
                    editable: true
                });
            }
        }).catch( err=> {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        });

    } else if (userRole === 'Admin') {
        Payment.find({
            adminId: userId
        }).where({month: reqMonth}).then( adminDocuments => {
            console.log(adminDocuments);
            if (adminDocuments.length < 1 ) {
                return res.status(404).json({
                    message: 'No Data found'
                });
            }
            else{
                res.status(200).json({
                    message: prop.userDetails(adminDocuments),
                    editable: true
                });
            }
        })
    }
}

exports.updateStatus = (req, res, next) => {

    const reqId = req.params.editId;
    const userRole = req.userRole;
    const userId = req.userId;

    if (userRole === 'Admin') {
        
        Payment.findById(reqId).then( result => {
            result.status = 1

            return result.save().then( saved => {
                console.log(saved)
                res.status(308).redirect('/api/received');
            })
        }).catch( err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

    }
    else if (userRole === 'User' ) {
        const reqId = req.params.editId;
        AdminPay.findById(reqId).then( result => {
            result.status = 1

            return result.save().then( saved => {
                console.log(saved);
                res.status(308).redirect('/api/received');
            });
        }).catch( err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
    }

}