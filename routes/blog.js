const router = require("koa-router")();
const blogController = require("../controller/blog.js");

router.post("/api/blog/init",blogController.initBlog,blogController.initBlogNext);

module.exports = router;