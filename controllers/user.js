let userController = {};
const _ = require("lodash");
const path = require("path");
const formidable = require("formidable");
const User = require("../models/user");
const uploadFolder = path.join(__dirname, "../", "uploads", "profilePics");

let errorHandler = require("../utils/errorHandler");
const fs = require("fs");
var crypto = require("crypto");
var nodemailer = require("nodemailer");
var frontEndUrl = "http://localhost:3000/forgot-password";

let helper = require("../utils/hepler");

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465
    auth: {
        user: "jaykaravadra77@gmail.com", // your gmail email adress
        pass: "jay@3454"// your gmail password
    }
});

function verifySmtp() {
    // verify connection configuration
    transporter.verify(function (error) {
        if (error) {
            //dis
            console.log(error);
        } else {
            console.log("Server is ready for emails");
        }
        return true;
    });
}
verifySmtp();
userController.changeprofile = (req, res) => {

    try {
        let options = {
            uploadDir: uploadFolder,
        };

        let form = new formidable.IncomingForm(options);
        form.parse(req, async (err, fields, files) => {
            try {
                if (err) return res.status(500).send({ message: "err in form parsing" });
                const isFileValid = (file) => {
                    const type = file.mimetype.split("/").pop();
                    const validTypes = ["jpg", "jpeg", "png"];
                    if (validTypes.indexOf(type) === -1) {
                        return false;
                    }
                    return true;
                };

                let user = req.user;


                if (!files.sPhoto) {
                    if (fs.existsSync(path.join(uploadFolder, user.sPhoto || "Default.png"))) {
                        fs.unlinkSync(path.join(uploadFolder, user.sPhoto));

                    }
                }


                if (files.sPhoto && !files.sPhoto.length) {
                    const file = files.sPhoto;
                    if (isFileValid(file)) {
                        if (file.size > 2000000) throw new Error("File size is too big (max 2MB)");
                        if (user.sPhoto) fs.unlinkSync(path.join(uploadFolder, user.sPhoto));
                        fs.renameSync(file.filepath, path.join(uploadFolder, `${user._id}.${file.mimetype.substring(file.mimetype.lastIndexOf("/") + 1)}`));
                        user.sPhoto = `${user._id}.${file.mimetype.substring(file.mimetype.lastIndexOf("/") + 1)}`;
                    } else {
                        throw new Error("Invalid file type");
                    }
                }

                user.sPhoto =  req.user.sPhoto || "Default.png";
                _.extend(user, fields);
                await User.findByIdAndUpdate(user._id, user,{runValidators:true});
                return res.status(200).send({ message: "Profile Updated Successfully" });

            } catch (error) {
                try {
                    if (files.sPhoto && fs.existsSync(path.join(uploadFolder, files.sPhoto.newFilename)))
                        fs.unlinkSync(path.join(uploadFolder, files.sPhoto.newFilename));
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.log(error);
                }
                
                errorHandler(req, res, error);
            }

        });

    } catch (error) {
        errorHandler(req, res, error);
    }
};

userController.linkforChanePassword = async (req, res) => {
    try {

        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                return res.status(500).send({ message: "Error in generating token" });
            }
            const token = buffer.toString("hex");
            let user = await User.findOne({ sEmail: req.body.sEmail });
            if (!user) return res.status(400).send("No user with this email");

            user.reqPasswordchangeToken = token;
            user.expireToken = Date.now() + 3600000;

            await user.save();


            transporter.sendMail({
                to: user.sEmail,
                from: "no-replay@insta.com",
                subject: "password reset",
                html: `
                        <p>You requested for password reset</p>
                        <h5>click in this <a href=${frontEndUrl}/${token}>link</a> to reset password</h5>
                  
                         <p>This link will expire in 1 hour</p>
                        `

            });
            return res.status(200).send({ message: "Email sent Please check your mail" });
        });
    } catch (error) {
        errorHandler(req,res,error);
    }
};

userController.newPassword = async (req, res) => {

    let { sPassword, token } = req.body;
    try {
        let user = await User.findOne({ reqPasswordchangeToken: token, expireToken: { $gt: Date.now() } });
        if (!user) return res.status(400).send("Invalid Token");
         

        user.reqPasswordchangeToken = undefined;
        user.expireToken = undefined;

        await User.findByIdAndUpdate(user._id, { $unset: { reqPasswordchangeToken: 1, expireToken: 1 }, $set: { sHash: helper.genrateHash(sPassword) } });
        res.status(200).send({message:"Password changed successfully"});
    } catch (error) {
        errorHandler(req,res,error);
    }
    
};

userController.changePassword = async (req, res) => {
    try {
        let {sPassword} = req.body;
        await User.findByIdAndUpdate(req.user._id, { $set: { sHash: helper.genrateHash(sPassword) } }); 
        return res.status(200).send({message:"Password changed successfully"});
    } catch (error) {
        errorHandler(req,res,error); 
    }
};         
        
 




module.exports = userController;