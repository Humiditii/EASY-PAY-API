exports.getActualMonth = (para) => {

    const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'];
        
        for (let index = 0; index < months.length; index++) {
            const trueMonth = months[para];
            return trueMonth;
        }
    }

exports.dateFormat = ( M,D,Y ) => {
    const month = M;
    const day = D;
    const year = Y;

    const toFormat = month+'/'+day+'/'+year;
    return toFormat;
}

exports.timeFormat = (H, M, S) => {
    const hour = H;
    const min = M;
    const sec = S;

    const timeStyle = hour+':'+min+':'+sec;
    return timeStyle;
}

exports.dateLoop = (param) => {
    for (let index = param; index < param - 3; index--) {
        let dateArray = [];
        dateArray.push(index);
       // console.log(dateArray);
        return dateArray;

    }
}
    