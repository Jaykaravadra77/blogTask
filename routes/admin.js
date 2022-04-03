let Router = require("express").Router();
let adminController = require("../controllers/admin");
const authCotroller = require("../controllers/auth");
let authMiddelware = require("../middlewares/auth");
 

Router.post("/createuser",authMiddelware.isAuth,authMiddelware.isAdmin,authCotroller.register); 
Router.get("/getusers",authMiddelware.isAuth,authMiddelware.isAdmin,adminController.getUsers);
Router.delete("/deleteuser/:id",authMiddelware.isAuth,authMiddelware.isAdmin,adminController.deleteUser);
Router.get("/searchuser",authMiddelware.isAuth,authMiddelware.isAdmin,adminController.searchUser);
 
Router.get("/blogposts",authMiddelware.isAuth,authMiddelware.isAdmin,adminController.blogposts);
Router.get("/dashboard",authMiddelware.isAuth,authMiddelware.isAdmin,adminController.dashboard);

module.exports = Router;