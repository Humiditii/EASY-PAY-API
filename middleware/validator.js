exports.lengthValidator = (params) =>{
    const checkLength = params;
    if (checkLength.length < 0 ) {
        let err = 'Length must be greater than 0';
        throw err;
    }else if( checkLength.length < 5 ){
        let err = 'More than five characters required';
        throw err;
    }else{
        return checkLength.trim();
    }
}
