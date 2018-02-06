const ArticleController = require("../controller/article.js");
const router = require("koa-router")();
router.post("/api/article/uploadimage", ArticleController.uploader, ArticleController.uploadImage);
router.post("/api/article/savearticle", ArticleController.saveArticle);
router.post("/api/article/deletearticle", ArticleController.deleteArticle);
router.post("/api/article/getarticle", ArticleController.getArticle,ArticleController.getArticleNext);
router.post("/api/article/clearunusedimage", ArticleController.clearUnusedImage);
module.exports = router;