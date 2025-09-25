class ExpressError extends Error{
    constructor(status,message){
         super(); 
        //  inherits all the code of error class
        this.status=status;
        this.message=message;
    }
}

module.exports=ExpressError; 