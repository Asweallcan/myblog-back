const router = require("koa-router")();
const indexController = require("../controller/index.js");
// router.get("*", async ctx => {
//   await ctx.render("index");
// });

router.get("/api/index/init", indexController.initIndex);
router.post("/api/index/getarticlebytitle",indexController.getArticleByTitle);

module.exports = router;
