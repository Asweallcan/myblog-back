const ArticleController = require("../controller/article.js");
const router = require("koa-router")();
router.post("/api/article/uploadimage", ArticleController.uploader, ArticleController.uploadImage,ArticleController.uploadImageNext);
router.post("/api/article/save", ArticleController.save);
router.post("/api/article/getarticles", ArticleController.getArticles);
router.post("/api/article/delete", ArticleController.delete);
router.post("/api/article/clearunusedimage", ArticleController.clearUnusedImage);
module.exports = router;