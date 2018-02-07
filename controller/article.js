/*
 * @Author: lvshihao
 * @Date: 2018-02-06 09:31:02
 * @Last Modified by: lvshihao
 * @Last Modified time: 2018-02-07 09:13:43
 */
// import {Promise} from "mongoose";

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
                .resize(800, null, ">")
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
                let articles = await Article.Find({
                    conditions: {},
                    projections: {
                        __v: 0,
                        comments: 0,
                        author: 0,
                        description: 0,
                        tags: 0,
                        content: 0
                    }
                });
                console.log(articles);
                ctx.response.body = articles
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


