
const mongoose = require("mongoose");

//create a schema for blog
const blogSchema = new mongoose.Schema({
    sTitle: {
        type: String,
        required: [true, "Title is required"],
        minlength:  [1, "Description must be at least 1 characters long"],
        trim:true,
        unique:true
    },
    sDescription: {
        type: String,
        required: [true, "Descreption is required"],
        minlength: [10, "Description must be at least 10 characters long"],
        trim:true
    },
    sPhoto:{
        type: String,
    },
    oPostedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    dPublishedDate: {
        type: Date,
        default: Date.now,
        validate: {
            validator: function (v) {
                 
                
                let publishedDate = new Date(v);
                if(publishedDate.getDate() >= new Date().getDate() && publishedDate.getMonth() >= new Date().getMonth() && publishedDate.getFullYear() >= new Date().getFullYear()){
                    return true;
                }
                return false;
            },
            message: " Published Date must be greater than or equals to today's date"
        },
       
       
    },
    bPublished:
    {
        type: Boolean,
        default: false
    },
    aLikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    
},{timestamps:true});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;