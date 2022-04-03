

function errorHandler(req, res, error) {
    if (error.code == 11000) {
        //create switch case 
        let message = "";
        switch (Object.keys(error.keyValue)[0]) {
        case "sEmail":
            message = "email already exists";
            break;
        case "nMobileNo":
            message = "mobileNo already exists";
            break;
        case "sTitle":
            message = "BlogTitle already exists";
            break;
        default:
            message = "Something went wrong";
            break;
        }
        return res.status(400).send({ message: message });
    }
    
    if (error.name == "ValidationError") {
        let message = [];
        for (let errorName in error.errors) {

            if (error.errors[errorName].message)
                if (error.errors[errorName].kind == "maxlength") {
                    let index = error.errors[errorName].message.lastIndexOf("the");
                    let msg = `${errorName}'s ${error.errors[errorName].message.substring(index + 4)}`;
                    message.push(msg);
                } else {
                    message.push(error.errors[errorName].message);
                }
        }
        return res.status(400).send({ message: message[message.length - 1] });
    }

    return res.status(500).send({ message: error.message });

}


module.exports = errorHandler;