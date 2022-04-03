
let blogController = {};
//require formidabe, nodemailer 
const formidable = require("formidable");
let path = require("path");
const Blog = require("../models/blog");    
let EventEmitter = require("events");
const uploadBlogfolder = path.join(__dirname, "../", "uploads", "blog");
const fs = require("fs");
const errorHandler = require("../utils/errorHandler");

blogController.postBlog = async (req, res) => {
    
    try {

        let options = {
            uploadDir: uploadBlogfolder,
        };

        let form = new formidable.IncomingForm(options);
        form.parse(req, async (err, fields, files) => {
            try {
                if(err) return res.status(500).send({ message: "err in form parsing" });
               
                let dPublishedDate = fields.dPublishedDate;
                if(!dPublishedDate) return res.status(400).send({message:"Date is required"});
                Date.prototype.isValid = function () {
                    return this.getTime() === this.getTime();
                };
            
                let date = new Date(dPublishedDate);
                if(!date.isValid()) throw new Error("Invalid date");

                const isFileValid = (file) => {
                    const type = file.mimetype.split("/").pop();
                    const validTypes = ["jpg", "jpeg", "png"];
                    if (validTypes.indexOf(type) === -1) {
                        return false;
                    }
                    return true;
                };
              
                let blog = await Blog.create({
                    sTitle: fields.sTitle,
                    sDescription: fields.sDescription,
                    oPostedBy: req.user._id,
                    dPublishedDate: fields.dPublishedDate,
                    
                });
                
                if (files.sPhoto && !files.sPhoto.length) {
                    const file = files.sPhoto;
                    if (isFileValid(file)) {
                        if(file.size > 2000000) throw new Error("File size is too big (max 2MB)");
                        fs.renameSync(file.filepath, path.join(uploadBlogfolder, `${blog._id}.${file.mimetype.substring(file.mimetype.lastIndexOf("/") + 1)}`));
                        blog.sPhoto = `${blog._id}.${file.mimetype.substring(file.mimetype.lastIndexOf("/") + 1)}`;
                    } else {
                        throw new Error("Invalid file type");
                    }
                }
                blog.sPhoto = blog.sPhoto || "";
                await blog.save();
                const myEmitter = new EventEmitter();
                myEmitter.on("published Manage", () => {
                    setTimeout(async() => {
                        await Blog.findByIdAndUpdate(blog._id,{$set:{"bPublished":true}});
                    }, date.getTime() - new Date().getTime());
                });

                myEmitter.emit("published Manage");
                return res.status(200).send({ message: "Blog Posted successfully" });

            } catch (error) {
                try {
                    if (files.sPhoto && fs.existsSync(path.join(uploadBlogfolder, files.sPhoto.newFilename)))
                        fs.unlinkSync(path.join(uploadBlogfolder, files.sPhoto.newFilename));
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

blogController.blogfeed = async (req, res) => {
    try {
        let blogs = await Blog.find({ bPublished: true }).sort({ dPublishedDate: -1 }).select(" -sPhoto -__v -bPublished -aLikes " ).populate("oPostedBy","sUsername -_id");
        return res.status(200).send({message:"blogs fetched successfully", blogs });
    } catch (error) {
        errorHandler(req, res, error);
    }
};

blogController.like = async (req, res) => {
    try {
        let blog = await Blog.findById(req.params.blogid);
        if(!blog) return res.status(404).send({message:"Blog not found"});
        if(blog.aLikes.indexOf(req.user._id) === -1) {
            blog.aLikes.push(req.user._id);
            await blog.save();
            return res.status(200).send({message:"Blog liked successfully",likes:blog.aLikes.length});
        }else{
            blog.aLikes.splice(blog.aLikes.indexOf(req.user._id),1);
            await blog.save();
            return res.status(200).send({message:"Blog unliked successfully",likes:blog.aLikes.length});
        }
    } catch (error) {
        errorHandler(req, res, error);
    }
};
module.exports  = blogController;