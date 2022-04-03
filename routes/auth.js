let Router = require("express").Router();
let authController = require("../controllers/auth");
let authMiddleware = require("../middlewares/auth");

Router.post("/register" ,authController.register);
Router.post("/login",authMiddleware.loginValidator,authController.login);

// Router.post("/editProfile",authController.editProfile);


module.exports = Router;