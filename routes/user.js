//create simple router for user
var express = require("express");
var router = express.Router();
var userController = require("../controllers/user");
var authMiddleware = require("../middlewares/auth");
const userMiddleware = require("../middlewares/user");

 

router.put("/editprofile", authMiddleware.isAuth, userController.changeprofile);
router.post("/reset-password", userController.linkforChanePassword);
router.post("/new-password",userMiddleware.validatePassword, userController.newPassword);
router.post("/change-password", authMiddleware.isAuth,userMiddleware.validatePassword, userController.changePassword);
 

module.exports = router;