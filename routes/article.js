const ArticleController = require("../controller/article.js");
const router = require("koa-router")();
router.post("/api/article/uploadimage",ArticleController.uploader,ArticleController.uploadImage,ArticleController.uploadImageNext);
router.post("/api/article/ifarticle",ArticleController.ifArticle);
router.post("/api/article/savearticle",ArticleController.saveArticle);
router.post("/api/article/deletearticle",ArticleController.deleteArticle);
router.post("/api/article/getarticles",ArticleController.getArticles);
router.post("/api/article/clearunusedimage",ArticleController.clearUnusedImage);
module.exports = router;