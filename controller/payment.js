const User = require('../models/authModel'); 
const Pin = require('../models/pinGenModel');
const Payment = require('../models/paymentModel');
const dateActual = require('../middleware/date');
const prop = require('../middleware/populate');
const AdminPay = require('../models/adminPaymentModel');

exports.getPayment = (req, res, next) => {
    const userId = req.userId;
    
    User.findById(userId).then( user => {
        const userRole = user.role;
        if (userRole == 'User') {
            const userPin = user.pin;
            Pin.findOne({ pin: userPin}).then( pinDetails => {
                const admin = pinDetails.adminId;
                User.findById(admin).then( adminData => {
                    const adminName = adminData.name;
                    const payerName = user.name;
                    res.status(200).json({
                        data: {
                            admin: adminName,
                            depositor: payerName,
                            adminId: adminData._id
                        }
                    });
                }).catch( err => {
                   if (!err.statusCode) {
                       err.statusCode = 500;
                   }
                   next(err);
                });
            }).catch( err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
        } else if (userRole === 'Admin') {

           User.find({ adminId: userId }).then( adminClients => {
               const data = prop.getNames(adminClients);
                res.status(200).json({
                    message: data
                });
           }).catch( err => {
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

exports.postPayment = (req, res, next) => {
     const userId = req.userId;
     const reqUserRole = req.userRole;

    if (reqUserRole === 'User') {
        const adminName = req.body.admin;
        const reqAdminId = req.body.adminId;
        const reqDepositorId = userId;
        const depositorName = req.body.depositor;
        const reqAmount = req.body.amount;
        const reqStatus = 0;
        // const time = new Date();
        const currentDate = new Date();
        const getDay = currentDate.getDate();
        const rawMonth = currentDate.getMonth();
        const getMonth = dateActual.getActualMonth(rawMonth);
        const getYear  = currentDate.g.etFullYear();

        const getHours = currentDate.getHours();
        const getMin = currentDate.getMinutes();
        const getSec = currentDate.getSeconds();
        
        const formattedTime = dateActual.timeFormat(getHours, getMin, getSec);

        const formattedDate = dateActual.dateFormat(rawMonth, getDay, getYear);
        
 

        const newPayment = new Payment({
            admin: adminName,
            adminId: reqAdminId,
            depositorId: reqDepositorId,
            depositor: depositorName,
            amount: reqAmount,
            status: reqStatus,
            time: formattedTime,
            month: rawMonth,
            day: getDay,
            year: getYear,
            date: formattedDate
        });

        return newPayment.save().then(paymentResult => {
            res.status(201).send({
                message: paymentResult
            });
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode
            }
            next(err);
        });
    } else if (reqUserRole === 'Admin') {
        const receiverName = req.body.name;
        const receiverId = req.body.id;
        const amount = req.body.amount;
        const adminId = userId;
        const status = 0;

        const currentDate = new Date();
        const getDay = currentDate.getDate();
        const rawMonth = currentDate.getMonth();
        const getMonth = dateActual.getActualMonth(rawMonth);
        const getYear = currentDate.getFullYear();

        const getHours = currentDate.getHours();
        const getMin = currentDate.getMinutes();
        const getSec = currentDate.getSeconds();

        const formattedTime = dateActual.timeFormat(getHours, getMin, getSec);

        const formattedDate = dateActual.dateFormat(rawMonth, getDay, getYear);

        const time = formattedTime;
        const month = rawMonth;
        const day = getDay;
        const year = getYear;
        const date = formattedDate;

        
        Payment.find({ adminId: userId}).then( adminDocuments => {
            const adminObject = prop.adminDetails(adminDocuments);
            const balanceAmount = adminObject.Amount;
            if (amount !== balanceAmount || amount > balanceAmount ) {

                return res.status(400).json({
                    message: 'Insufficient funds',
                });
                 
            } else if (amount == balanceAmount || amount < balanceAmount) {
                 const admminPay = new AdminPay({
                     receiverName: receiverName,
                     receiverId: receiverId,
                     amount: amount,
                     adminId: adminId,
                     status: status,
                     time: time,
                     month: month,
                     day: day,
                     year: year,
                     date: date
                 });

                 return admminPay.save().then(result => {
                     res.status(201).json({
                         message: {
                             Receiver: result.receiverName,
                             AdminId: adminId,
                             Amount: amount,
                             Time: time,
                             Date: date
                         }
                     });
                 }).catch(err => {
                     if (!err.statusCode) {
                         err.statusCode = 500;
                     }
                     next(err);
                 });
            }
        }).catch( err => {
            if (err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
    }
}

