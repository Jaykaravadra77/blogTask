//require bcrypt
const bcrypt = require("bcryptjs");  //require bcrypt

let helper = {};

helper.genrateHash=(plainPassword)=>{
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(plainPassword, salt);
    return hash;
};

helper.comparePassword=(plainPassword, hashPassword)=>{
    return bcrypt.compareSync(plainPassword, hashPassword);
};

module.exports = helper;

