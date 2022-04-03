let adminController = {};
let User = require("../models/user");
const errorHandler = require("../utils/errorHandler");

let Blog = require("../models/blog");
 

adminController.getUsers = async(req, res) => {
    try {
    
        req.query.sortBy = req.query.sortBy || "createdAt";
        let order = req.query.order || "asc";
        let query =req.query.sortBy;

        let users = await User.find({}).sort({[query]:parseInt(order)});
        return res.status(200).send({message:"Users fetched successfully",users});
    } catch (error) {
        errorHandler(req,res,error);
    }

};

adminController.deleteUser = async(req, res) => {
    try {
        let user= await User.findByIdAndDelete(req.params.id);
        if(!user)return res.status(400).send({message:"User not found"});
        return res.status(200).send({message:"User deleted successfully"});
    } catch (error) {
        errorHandler(req,res,error);
    }
};


adminController.blogposts = async(req, res) => {
    try {
    
        if(req.query.bPublished)var  blogs = await Blog.find({bPublished:req.query.bPublished});
        // eslint-disable-next-line  
        else  var blogs = await Blog.find({});
        return res.status(200).send({message:"Posts fetched successfully",blogs});
        
    } catch (error) {
        errorHandler(req,res,error);
    }
};

adminController.searchUser = async(req, res) => {
    try {
        let searchKeys = {sUsername:"sUsername",sEmail:"sEmail",_id:"_id"};
        let key =Object.keys(req.body)[0];
        if(searchKeys[key]){
            let users = await User.find({[key]:req.body[key]});
            if(users.length==0)return res.status(400).send({message:"User not found"});
            return res.status(200).send({message:"Users fetched successfully",users});
        }else{
            return res.status(400).send({message:"Invalid search key"});
        }
    } catch (error) {
        errorHandler(req,res,error);
    }
};

adminController.dashboard = async(req, res) => {
    try {
        let blog =await Blog.aggregate([
            {$match:{bPublished:true}},
            {$lookup: {
                from: "users",  
                localField: "oPostedBy",
                foreignField: "_id",
                as: "PostedBy"
            }
            },
            {$project: {_id:1,sTitle:1,sDescription:1,PostedBy:"$PostedBy.sUsername", like: { $size:"$aLikes" }}},
            {$sort: { likes: -1 }},
        
        ]);
        return res.status(200).send({message:"Posts fetched successfully",blog});
    } catch (error) {
        errorHandler(req,res,error);
    }
};
 


module.exports = adminController;