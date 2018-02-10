/*
 * @Author: lvshihao
 * @Date: 2018-02-06 09:31:02
 * @Last Modified by: lvshihao
 * @Last Modified time: 2018-02-10 10:32:37
 */
// import {Promise} from "mongoose";

const Article = require("../module/article.js");
const Admin = require("../module/admin.js")
const config = require(__dirname + "/../config.js");
const busboy = require("koa-busboy");
const path = require("path");
const gm = require("gm");
const async_fs = require("async-file");
const del = require("del");
const cheerio = require("cheerio");

let imageName;
exports.uploader = busboy({
    dest: `${config.articleImagePath}/temp`,
    fnDestFilename: (fieldname, filename) => {
        imageName = String(new Date().getTime() + Math.floor(Math.random() * 100)) + path.extname(filename);
        return imageName;
    }
});

exports.uploadImage = async(ctx, next) => {
    try {
        await next();
        ctx.response.body = `${config.urlPath}/articles/${ctx.request.body.title}/${imageName}`;
    } catch (err) {
        throw new Error(err);
    };
}

exports.uploadImageNext = async ctx => {
    return new Promise(async(resolve, reject) => {
        try {
            const oldpath = `${config.articleImagePath}/temp/${imageName}`;
            const newpath = `${config.articleImagePath}/${ctx.request.body.title}/${imageName}`;
            if (!await async_fs.exists(`${config.articleImagePath}/${ctx.request.body.title}`)) {
                await async_fs.mkdir(`${config.articleImagePath}/${ctx.request.body.title}`);
            }
            await async_fs.rename(oldpath, newpath);
            gm(newpath)
                .resize(1024, null, ">")
                .quality(70)
                .write(newpath, err => {
                    if (err) {
                        reject(err);
                    }
                    resolve(1);
                });
        } catch (err) {
            reject(err);
        }
    })
}

exports.save = async ctx => {
    try {
        if (!ctx.request.body.image.length) {
            if (await async_fs.exists(`${config.articleImagePath}/${ctx.request.body.title}`)) 
                await del([`${config.articleImagePath}/${ctx.request.body.title}`], {force: true});
            }
        else {
            const image = await async_fs.readdir(`${config.articleImagePath}/${ctx.request.body.title}`);
            if (image.toString() !== ctx.request.body.image.toString()) {
                for (let i = 0, temp; temp = image[i++];) {
                    if (!(ctx.request.body.image.includes(temp))) {
                        await del([`${config.articleImagePath}/${ctx.request.body.title}/${temp}`])
                    }
                }
            }
        }
        if (ctx.request.body.id) {
            await Article.Update({
                conditions: {
                    _id: ctx.request.body.id
                },
                doc: {
                    title: ctx.request.body.title,
                    tags: ctx
                        .request
                        .body
                        .tags
                        .split("/"),
                    content: ctx.request.body.content,
                    author: ctx.request.body.author,
                    description: ctx.request.body.description
                },
                options: {}
            })
        } else {
            await Article.Create({
                doc: {
                    title: ctx.request.body.title,
                    tags: ctx
                        .request
                        .body
                        .tags
                        .split("/"),
                    content: ctx.request.body.content,
                    author: ctx.request.body.author,
                    description: ctx.request.body.description
                }
            })
        }
        ctx.response.body = 1;
    } catch (err) {
        ctx.response.body = -1;
        throw new Error(err);
    }
};

exports.delete = async ctx => {
    try {
        if (await async_fs.exists(`${config.articleImagePath}/${ctx.request.body.title}`)) {
            await del([`${config.articleImagePath}/${ctx.request.body.title}`], {force: true});
        }
        await Article.Remove({
            conditions: {
                _id: ctx.request.body.id
            }
        });
        ctx.response.body = 1;
    } catch (err) {
        ctx.response.body = -1;
        throw new Error(err);
    }
};

exports.getArticles = async(ctx, next) => {
    switch (ctx.request.body.type) {
        case "admin":
            try {
                const page = ctx.request.body.page - 1;
                const skip = page * 10;
                const articles = await Article.Find({
                    conditions: {
                        author: ctx.request.body.author
                    },
                    projections: {
                        __v: 0,
                        time: 0,
                        comments: 0,
                        author: 0
                    },
                    options: {
                        limit: 10,
                        skip,
                        sort: {
                            time: -1
                        }
                    }
                });
                const count = await Article.Count({
                    conditions: {
                        author: ctx.request.body.author
                    }
                });
                ctx.response.type = "application/json";
                ctx.response.body = {
                    articles,
                    totalPages: Math.max(Math.ceil(count / 10), 1)
                };
                break;
            } catch (err) {
                throw new Error;
                break;
            }
        case "index":
            try {
                const articles = await Article.Find({
                    conditions: {},
                    projections: {
                        __v: 0,
                        comments: 0,
                        author: 0,
                        description: 0,
                        tags: 0,
                        content: 0
                    },
                    options: {
                        sort: {
                            time: -1
                        }
                    }
                });
                ctx.response.body = articles
                break;
            } catch (err) {
                throw new Error(err);
                break;
            }
        case "blog":
            try {
                const page = ctx.request.body.page - 1;
                const skip = page * 5;
                const limit = 5;
                const search = new RegExp(ctx.request.body.search, "gi");
                const tags = [];
                tags.push(ctx.request.body.search);
                const articles = await Article.Find({
                    conditions: {
                        $or: [
                            {
                                title: {
                                    $regex: search
                                }
                            }, {
                                content: {
                                    $regex: search
                                }
                            }, {
                                tags: {
                                    $in: tags
                                }
                            }
                        ]
                    },
                    projections: {
                        comments: 0,
                        __v: 0,
                        content: 0
                    },
                    options: {
                        sort: {
                            time: -1
                        },
                        skip,
                        limit
                    }
                })
                for (let i = 0, article; article = articles[i++];) {
                    let username = article.author;
                    let user = await Admin.Find({
                        conditions: {
                            username: username
                        },
                        projections: {
                            __v: 0,
                            password: 0,
                            username: 0,
                            _id: 0
                        },
                        options: {}
                    });
                    let image;
                    if (await async_fs.exists(`${config.articleImagePath}/${article.title}`)) {
                        image = await async_fs.readdir(`${config.articleImagePath}/${article.title}`)[0];
                    }
                    articles[i - 1] = {
                        ...articles[i - 1]._doc,
                        nickname: user[0].nickname,
                        image: image
                            ? image
                            : ""
                    };
                }
                const count = await Article.Count({
                    conditions: {
                        $or: [
                            {
                                title: {
                                    $regex: search
                                }
                            }, {
                                content: {
                                    $regex: search
                                }
                            }, {
                                tags: {
                                    $in: tags
                                }
                            }
                        ]
                    }
                });
                const totalPages = Math.max(Math.ceil(count / 5), 1);
                ctx.response.type = "application/json";
                ctx.response.body = {
                    articles: articles,
                    totalPages
                }
                break;
            } catch (err) {
                throw new Error(err);
                break;
            }
        case "article":
            try {
                const article = await Article.Find({
                    conditions: {
                        _id: ctx.request.body.id
                    },
                    projections: {},
                    options: {}
                });
                ctx.response.body = article[0];
            } catch (err) {
                throw new Error(err);
                break;
            }
        default:
            break;
    }
};