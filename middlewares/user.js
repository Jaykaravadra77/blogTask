let userMiddleware = {};
 

userMiddleware.validatePassword = (req, res, next) => {
    let { sPassword, sConfirmPassword } = req.body;
    if(typeof sPassword !== "string" || typeof sConfirmPassword !== "string"){
        return res.status(400).send({message:"password and confirm password must be string"});
    }
 
    if (!(sPassword && sPassword.toString().trim().length > 0 && sConfirmPassword && sConfirmPassword.toString().trim().length>0 ) ) return res.status(400).send({ message: "All fields are mandatory" });
    if (sPassword !== sConfirmPassword) return res.status(400).send({ message: "Password and confirm password does not match" });
    next();
};
 

module.exports = userMiddleware;