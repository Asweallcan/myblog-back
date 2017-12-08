const ArticleController = require("../controller/article.js");
const router = require("koa-router")();
router.post("/api/api/article/uploadimage",ArticleController.uploader,ArticleController.uploadImage,ArticleController.uploadImageNext);
router.post("/api/api/article/ifarticle",ArticleController.ifArticle);
router.post("/api/api/article/savearticle",ArticleController.saveArticle);
router.post("/api/api/article/deletearticle",ArticleController.deleteArticle);
router.get("/api/api/article/getarticle",ArticleController.getArticle);
router.post("/api/api/article/clearunusedimage",ArticleController.clearUnusedImage);
module.exports = router;