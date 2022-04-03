let authCotroller = {};
let User = require("../models/user");
let errorHandler = require("../utils/errorHandler");
var bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");
let formidable = require("formidable");
let path = require("path");
let fs = require("fs");
const uploadFolder = path.join(__dirname, "../", "uploads","profilePics");
let helper = require("../utils/hepler");
 
authCotroller.register = async (req, res) => {
    try {

        let options = {
            uploadDir: uploadFolder,
        };

        let form = new formidable.IncomingForm(options);
        form.parse(req, async (err, fields, files) => {
            try {
                if(err) return res.status(500).send({ message: "err in form parsing" });
                let {sPassword } = fields;
                if(typeof sPassword != "string") throw new Error("Password is must be string");
                if(!(sPassword && sPassword.trim().length >=1 )) throw new Error("minimum length of password is 1");

             
                fields.sHash = helper.genrateHash(sPassword);
                delete fields.sPassword;

                const isFileValid = (file) => {
                    const type = file.mimetype.split("/").pop();
                    const validTypes = ["jpg", "jpeg", "png"];
                    if (validTypes.indexOf(type) === -1) {
                        return false;
                    }
                    return true;
                };
              
                let user  = await User.create(fields);
                
                if (files.sPhoto && !files.sPhoto.length) {
                    const file = files.sPhoto;
                    if (isFileValid(file)) {
                        if(file.size > 2000000) throw new Error("File size is too big (max 2MB)");
                        fs.renameSync(file.filepath, path.join(uploadFolder, `${user._id}.${file.mimetype.substring(file.mimetype.lastIndexOf("/") + 1)}`));
                        user.sPhoto = `${user._id}.${file.mimetype.substring(file.mimetype.lastIndexOf("/") + 1)}`;
                    } else {
                        throw new Error("Invalid file type");
                    }
                }
                
                
                await user.save();
                return res.status(200).send({ message: "Registerd successfully" });

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

authCotroller.login = async (req, res) => {
    try {
        let {sEmail, sPassword  } = req.body;

        let user = await User.findOne({sEmail});
        if (!user) return res.status(400).send({ message: "Invalid Credentials" });

        if (helper.comparePassword(sPassword, user.sHash)) {
            const token = jwt.sign(
                { userId: user._id },
                process.env.SECRETE_KEY
                 
            );

            return res.status(200).send({ message: "Loged in successfully", token });
        } else {
            return res.status(400).send({ message: "Invalid credentials" });
        }

    } catch (error) {
        errorHandler(req, res, error);
    }
};

 



module.exports = authCotroller;