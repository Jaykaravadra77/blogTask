
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const blogController = require("../controllers/blog");

router.post("/postblog", authMiddleware.isAuth, blogController.postBlog);
router.get("/blogfeed",  blogController.blogfeed);
router.post("/like/:blogid", authMiddleware.isAuth, blogController.like);

module.exports = router;