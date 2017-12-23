const router = require("koa-router")();
const Article = require("../module/article.js");

router.get("*",async ctx=>{
    await ctx.render("index");
});

router.post("/api/index/getarticles", async (ctx,next) => {
    try {
        let search = new RegExp(ctx.request.body.search || "", "gi");
        let searchTags = ctx.request.body.searchTags;
        let currentPage = ctx.request.body.currentPage;
        let articles = [];
        let count = 0;
        if (searchTags.length > 0) {
            articles = await Article.getArticle({
                query: {$or: [{title: {$regex: search}}, {content: {$regex: search}}],tags: {$in: searchTags}},
                limit: 5,
                skip: (currentPage - 1) * 5,
                sort: {time: -1}
            });
            count = await Article.getCount({$or: [{title: {$regex: search}}, {content: {$regex: search}}, {tags: {$in: searchTags}}]});
        } else {
            articles = await Article.getArticle({
                query: {$or: [{title: {$regex: search}}, {content: {$regex: search}}, {tags: {$in: [search]}}]},
                limit: 5,
                skip: (currentPage - 1) * 5,
                sort: {time: -1}
            });
            count = await Article.getCount({$or: [{title: {$regex: search}}, {content: {$regex: search}}, {tags: {$in: [search]}}]});
        }
        articles.forEach((el,index,input)=>{
            let regexp1 = /<p>[^<>\/]+<\/p>/;
            let regexp2 = /<img[^<>]+>/;
            let ret1 = el.content.match(regexp1) || "";
            let ret2 = el.content.match(regexp2) || "";
            let ret = ret1 + ret2;
            input[index].content = ret;
        });
        ctx.response.type = "application/json";
        ctx.response.body = {articles: articles, count: count};
    } catch (err) {
        console.log(err)
    }
});

router.post("/api/index/getarticlebytitle",async ctx=>{
    let title = ctx.request.body.title;
    let article = await Article.getArticle({query:{title:title}});
    if(!article){
        router.redirect("/error");
    }
    ctx.response.type = 'application/json';
    ctx.response.body = {article:article};
});

module.exports = router;