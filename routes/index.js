const router = require("koa-router")();
const indexController = require("../controller/index.js");

router.get("*", async ctx => {
    await ctx.render("index");
});

router.post("/api/index/getarticlebytitle", indexController.getArticleByTitle);
router.post("/api/index/nba/image",indexController.getNBAimg,indexController.getNBAimgNext);
router.post("/api/index/nba/news",indexController.getNBAnews,indexController.getNBAnewsNext);
router.post("/api/index/game",indexController.getGamesInfo,indexController.getGamesInfoNext);
router.post("/api/index/bizhi",indexController.getBizhi,indexController.getBizhiNext);
router.post("/api/index/movie",indexController.getMoviesInfo,indexController.getMoviesInfoNext);
router.post("/api/index/article",indexController.getArticle);

module.exports = router;
