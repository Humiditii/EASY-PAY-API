const User = require('../models/authModel');
const Payment = require('../models/paymentModel');
const prop = require('../middleware/populate');


// View the home page of the particular user logged in 
exports.viewHome = (req, res, next) => {
    const userRole = req.userRole;
    const userId = req.userId;

    // Trying to get the current month
    const currentDate = new Date();
    const reqMonth = currentDate.getMonth();

    //Checking for the type of user logged in for the rendered data
    if (userRole === 'User') {
        Payment.find({depositorId : userId}).where({ month: reqMonth }).then( userDocuments => {
            
            // getting specific property from the UserDocuments object array
            const reqAmount = prop.getProp(userDocuments);
            const reqDate = prop.popDate(userDocuments);
            const admin = prop.popAdmin(userDocuments);
            const sumAmount = reqAmount.reduce((a, b) => a + b);
            //console.log(admin);
            // amount.reduce((a, b) => a + b ); to add values in an array
            res.status(200).send({
                data: {
                    amount: reqAmount,
                    date: reqDate,
                    adminName: admin,
                    totalAmount: sumAmount
                }
            });
       
          
        }).catch( err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
        
        // if the user logged in is Admin
    } else if (userRole === 'Admin') {
        const userId = req.userId;

        const currentDate = new Date();
        const reqMonth = currentDate.getMonth();

        //find all documents with the AdminId to get all amount paid related to the AdminId
        Payment.find({
                adminId: userId
            }).where({
                month: reqMonth
            }).then(result => {
            
            // getting certain properties from the result object array 
            const getAmount = prop.getProp(result);
            const admin = prop.popAdmin(result);
            
            res.status(200).json({
                message: {
                    totalAmount: getAmount,
                    adminName: admin
                }
            });
        }).catch( err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
    }
}