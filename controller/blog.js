const Article = require("../module/article.js");
const cheerio = require("cheerio");

exports.initBlog = async (ctx, next) => {
    try {
        let articles = await next();
        ctx.response.type = "application/json";
        ctx.response.body = {
            articles: articles.articles,
            count: articles.count
        }
    } catch (err) {
        console.log(err);
    }
};

exports.initBlogNext = async ctx => {
    return new Promise(async (resolve, reject) => {
        try {
            let regex = new RegExp(ctx.request.body.search || "", "gi");
            let tag = new Array(1);
            tag.push(ctx.request.body.search || "");
            let page = ctx.request.body.currentPage || 1;
            let articles = await Article.getArticle({
                query: {
                    $or: [{
                        title: {
                            $regex: regex
                        }
                    }, {
                        content: {
                            $regex: regex
                        }
                    }, {
                        tags: {
                            $in: tag
                        }
                    }]
                },
                limit: 10,
                skip: (page - 1) * 10,
                sort: {
                    time: 1
                }
            });
            let count = await Article.getCount({
                $or: [{
                    title: {
                        $regex: regex
                    }
                }, {
                    content: {
                        $regex: regex
                    }
                }, {
                    tags: {
                        $in: tag
                    }
                }]
            });
            let zhaiyao = [];
            articles.forEach((element, index) => {
                let $ = cheerio.load(element.content);
                let text = "";
                $("p,h1,h3,h4,h5,h6,strong,span,em,pre,b").each((index, element) => {
                    if (index > 3) {
                        return false;
                    }
                    if ($(element).text()) {
                        text += `<p>${$(element).text()}</p>`;
                    }
                });
                zhaiyao.push({
                    title: articles[index].title,
                    time: articles[index].time,
                    image: $("img").length > 0 ? $("img")[0].attribs.src: "",
                    tags: articles[index].tags,
                    text: text
                })
            });
            resolve({
                articles: zhaiyao,
                count: count
            });
        } catch (err) {
            reject(err);
        }
    })
};