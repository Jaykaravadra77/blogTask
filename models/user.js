let mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    sUsername:{
        type:String,
        required:[true,"Username should be required"],
        trim:true
    },
    sEmail:{
        type:String,
        required:[true,"Email should be required"],
        unique:true,
        validate: {
            validator: function (v) {
                return (/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(v));
            },
            message: props => `${props.value} is not a valid Email!`
        }
            
    },
    sHash:{
        type:String,
       
    },
    nMobileNo:{
        type:Number,
        required:[true,"MobileNo should be required"],
        unique:true,
        validate: {
            validator: function(v) {
                return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid MobileNumber!`
        }
    },
    sGender:{
        type:String,
        enum:["Male","Female"],
        required:[true,"gender should be required"],
    },
    sPhoto:{
        type:String,
        default:""
    },
    role:{
        type:Number,
        enum:[0,1],
        default:0
    },
    reqPasswordchangeToken:{
        type:String,
    },
    expireToken:{
        type:Number,
    }

    
},{timestamps:true});

let User = mongoose.model("User",userSchema);

module.exports = User;