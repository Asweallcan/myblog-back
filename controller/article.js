const Article = require("../module/article.js");
const config = require(__dirname + "/../config.js");
const busboy = require("koa-busboy");
const path = require("path");
const gm = require("gm");
const fs = require("fs");
const async_fs = require("async-file");
const del = require("del");

let imageName;
exports.uploader = busboy({
    dest: `${config.articleImagePath}/temp`,
    fnDestFilename: (fieldname, filename) => {
        imageName = String(new Date().getTime() + Math.floor(Math.random() * 100)) + path.extname(filename);
        return imageName;
    }
});

exports.uploadImage = async(ctx, next) => {
    ctx.response.body = `${config.urlPath}/articles/temp/${imageName}`;
};

exports.saveArticle = async ctx => {
    try {
        if (fs.existsSync(`${config.articleImagePath}/${ctx.request.body.article.title}`)) {
            if (!ctx.request.body.article.imageArray.length) {
                await del([`${config.articleImagePath}/${ctx.request.body.article.title}`], {force: true});
            } else {
                let imageArray = await async_fs.readdir(`${config.articleImagePath}/${ctx.request.body.article.title}`);
                if (imageArray.toString() !== ctx.request.body.article.imageArray.toString()) {
                    imageArray.forEach(async(el, index, input) => {
                        if (!ctx.request.body.article.imageArray.includes(el)) {
                            await async_fs.unlink(`${config.articleImagePath}/${ctx.request.body.article.title}/${el}`);
                        }
                    });
                }
            }
        }
        await Article.deleteArticle({title: ctx.request.body.article.title});
        await Article.insertArticle(ctx.request.body.article);
        ctx.response.body = 1;
    } catch (err) {
        throw new Error(err);
    }
};

exports.deleteArticle = async ctx => {
    try {
        await del([`${config.articleImagePath}/${ctx.request.body.title}`], {force: true});
        await Article.deleteArticle({title: ctx.request.body.title});
        ctx.response.body = 1;
    } catch (err) {
        throw new Error(err);
    }
};

exports.getArticle = async(ctx, next) => {
    switch (ctx.request.body.type) {
        case "admin":
            try {
                let regex = new RegExp(ctx.request.body.search || "", "gi");
                let tag = new Array(1);
                tag.push(ctx.request.body.search || "");
                let page = ctx.request.body.currentPage || 1;
                let articles = await Article.getArticle({
                    query: {
                        $or: [
                            {
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
                            }
                        ]
                    },
                    query2: {
                        title: 1,
                        _id: 0
                    },
                    limit: 10,
                    skip: (page - 1) * 10,
                    sort: {
                        time: 1
                    }
                });
                let count = await Article.getCount({
                    $or: [
                        {
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
                        }
                    ]
                });
                ctx.response.type = "application/json";
                ctx.response.body = {
                    articles: articles,
                    count: count
                };
                break;
            } catch (err) {
                throw new Error;
                break;
            }
        case "index":
            try {
                let articles = await Article.getArticle({
                    query: {},
                    query2: {
                        title: 1,
                        time: 1,
                        _id: 0
                    },
                    sort: {
                        time: -1
                    },
                    limit: 6
                });
                ctx.response.type = "application/json";
                console.log(articles);
                ctx.response.body = {
                    articles
                };
                break;
            } catch (err) {
                throw new Error(err);
                break;
            }
        case "blog":
            try {
                let data = await next();
                ctx.response.type = "application/json";
                ctx.response.body = {
                    articles: data.articles,
                    count: data.count
                };
                break;
            } catch (err) {
                throw new Error(err);
                break;
            }
        case "article":
            try {
                ctx.response.type = "application/json";
                ctx.response.body = {
                    article: await Article.getArticle({
                        query: {
                            title: ctx.request.body.title
                        }
                    })
                };
                break;
            } catch (err) {
                throw new Error(err);
                break;
            }
        default:
            break;
    }
};

exports.getArticleNext = async ctx => {
    return new Promise(async(resolve, reject) => {
        try {
            let regex = new RegExp(ctx.request.body.search || "", "gi");
            let tag = new Array(1);
            tag.push(ctx.request.body.search || "");
            let page = ctx.request.body.currentPage || 1;
            let articles = await Article.getArticle({
                query: {
                    $or: [
                        {
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
                        }
                    ]
                },
                sort: {
                    time: -1
                },
                limit: 5,
                skip: (page - 1) * 5
            });
            let count = await Article.getCount({
                $or: [
                    {
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
                    }
                ]
            });
            let zhaiyao = [];
            articles.forEach((element, index) => {
                let $ = cheerio.load(element.content);
                let text = "";
                $("p,h1,h3,h4,h5,h6,strong,span,em,pre,b,div").each((index, element) => {
                    if (index < 1) {
                        text += `<p>${$(element).text()}</p>`;
                    } else {
                        return false;
                    }
                });
                zhaiyao.push({
                    title: articles[index].title,
                    time: articles[index].time,
                    image: $("img").length > 0
                        ? $("img")[0].attribs.src
                        : "",
                    tags: articles[index].tags,
                    text: text || `<p>${articles[index].content}</p>`
                });
                console.log(zhaiyao);
            });
            resolve({articles: zhaiyao, count: count});
        } catch (err) {
            reject(err);
        }
    });
}

exports.clearUnusedImage = async ctx => {
    try {
        let imageArray = await async_fs.readdir(`${config.articleImagePath}/${ctx.request.body.title}`);
        if (imageArray.toString() !== ctx.request.body.imageArray.toString()) {
            imageArray.forEach(async(el, index, input) => {
                if (!ctx.request.body.imageArray.includes(el)) {
                    await async_fs.unlink(`${config.articleImagePath}/${ctx.request.body.title}/${el}`);
                }
            });
        }
        ctx.response.body = 1;
    } catch (err) {
        throw new Error(err);
    }
};
