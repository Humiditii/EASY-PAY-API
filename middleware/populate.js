exports.getProp = ( array ) => {

let emptyArray = [];
array.forEach(element => {
    emptyArray.push(element['amount']);
});

return emptyArray;


}

exports.popDate = ( array ) => {

    let dateArray = [];
    array.forEach(element => {
        dateArray.push(element['date']);
    });

    return dateArray;
}

exports.popAdmin = ( array ) => {
    let adminName = [];
    array.forEach(element => {
        adminName.push(element['admin']);
    });
    const oneName = adminName[0];

    return oneName;
}

exports.getNames = ( array ) => {
    let emptyName = [];
    let emptyId = [];

    let clientObject = {ids: emptyId, users:emptyName }

    array.forEach(element => {
        emptyName.push(element['name']);
        emptyId.push(element['_id']);
    });

    return clientObject
}

//Details Controller populate filters for adminId

exports.adminDetails = ( array ) => {
    let emptyId = [];
    let emptyReceiver = [];
    let emptyAmount = [];
    let emptyStatus = [];
    let emptyDate = [];
    let emptyTime = [];
    let emptyUserId = [];

    let AdminDetaileObject = {
        // type: 'SENT',
        id: emptyId,
        receiver: emptyReceiver,
        Amount: emptyAmount,
        status: emptyStatus,
        date: emptyDate,
        time: emptyTime,
        receiverId: emptyUserId
    }


    array.forEach ( element => {
        emptyId.push(element['_id']);
        emptyReceiver.push(element['receiverName']);
        emptyAmount.push(element['amount']);
        emptyStatus.push(element['status']);
        emptyDate.push(element['date']);
        emptyTime.push(element['time']);
        emptyUserId.push(element['receiverId']);

    });

    return AdminDetaileObject;
}

exports.userDetails = ( array ) => {
    let emptyId = [];
    let emptyAdmin = [];
    let emptyStatus = [];
    let emptyAmount = [];
    let emptyDate = [];
    let emptyTime = [];
    let emptyAdminId = [];

    let UserObject = {
        // type: 'SENT',
        id: emptyId,
        admin: emptyAdmin,
        status: emptyStatus,
        amount: emptyAmount,
        sentDate: emptyDate,
        sentTime: emptyTime,
        adminId: emptyAdminId
    }

    array.forEach ( element => {
        emptyId.push(element['_id']);
        emptyAdmin.push(element['admin']);
        emptyStatus.push(element['status']);
        emptyAmount.push(element['amount']);
        emptyDate.push(element['date']);
        emptyTime.push(element['time']);
        emptyAdminId.push(element['adminId']);
    });

    return UserObject;

}
