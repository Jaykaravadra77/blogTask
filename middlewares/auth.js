
let authMiddleware = {};
let jwt = require("jsonwebtoken");
const User = require("../models/user");
authMiddleware.loginValidator = (req,res,next)=>{
    let {sEmail,sPassword} = req.body;
    if(!(sEmail && sPassword)) return res.status(400).send({message:"All fields are Mandatory"});
    next();
};

authMiddleware.isAuth = async(req,res,next)=>{
    let sToken =   req.header("authorization") ;
    if(!sToken) return res.status(403).send({message: "Token required for authentication"});
    sToken = sToken.substring(7);
 
    try {
        const decoded = jwt.verify(sToken,process.env.SECRETE_KEY);
        let user=await User.findById(decoded.userId);
        if(!user) return res.status(401).send({message:"Unauthorized access denide"});
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).send({message:"Invalid Token AccessDenied"});
    }

};

authMiddleware.isAdmin = (req,res,next)=>{
    if(req.user.role !== 1) return res.status(403).send({message:"Unauthorized access denide"});
    next();
};


module.exports = authMiddleware;