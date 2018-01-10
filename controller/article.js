const Article = require("../module/article.js");
const config = require(__dirname + "/../config.js");
const busboy = require("koa-busboy");
const path = require("path");
const gm = require("gm");
const fs = require("fs");
const async_fs = require("async-file");
const del = require("del");

var imageName;
exports.uploader = busboy({
    dest: `${config.imagePath}/temp`,
    fnDestFilename: (fieldname, filename) => {
        imageName = String(new Date().getTime() + Math.floor(Math.random() * 100)) + path.extname(filename);
        return imageName;
    }
});

exports.uploadImage = async (ctx, next) => {
    try {
        await next();
        ctx.response.type = "application/json";
        ctx.response.body = {
            imageUrl: `${config.urlPath}/images/${ctx.request.body.title}/${imageName}`
        };
    } catch (err) {
        console.log(err);
    }
};

exports.uploadImageNext = async ctx => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!fs.existsSync(`${config.imagePath}/${ctx.request.body.title}`)) {
                await async_fs.mkdir(`${config.imagePath}/${ctx.request.body.title}`);
            }
            let oldPath = ctx.request.files[0].path;
            let newPath = `${config.imagePath}/${ctx.request.body.title}/${imageName}`;
            await async_fs.rename(oldPath, newPath);
            gm(newPath)
                .resize(900, ">")
                .write(newPath, function(err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(1);
                });
        } catch (err) {
            reject(err);
            console.log(err);
        }
    });
};

exports.ifArticle = async ctx => {
    try {
        let number = await Article.getCount({
            title: ctx.request.body.article.title
        });
        if (number) {
            ctx.response.body = -1;
            return;
        }
        await Article.saveArticle(ctx.request.body.article);
        ctx.response.body = 1;
    } catch (err) {
        console.log(err);
    }
};

exports.saveArticle = async ctx => {
    try {
        if (fs.existsSync(`${config.imagePath}/${ctx.request.body.article.title}`)) {
            if (!ctx.request.body.article.imageArray.length) {
                await del([`${config.imagePath}/${ctx.request.body.article.title}`], {
                    force: true
                });
            } else {
                let imageArray = await async_fs.readdir(`${config.imagePath}/${ctx.request.body.article.title}`);
                if (imageArray.toString() !== ctx.request.body.article.imageArray.toString()) {
                    imageArray.forEach(async (el, index, input) => {
                        if (!ctx.request.body.article.imageArray.includes(el)) {
                            await async_fs.unlink(`${config.imagePath}/${ctx.request.body.article.title}/${el}`);
                        }
                    });
                }
            }
        }
        await Article.removeArticle({
            title: ctx.request.body.article.title
        });
        await Article.saveArticle(ctx.request.body.article);
        ctx.response.body = 1;
    } catch (err) {
        console.log(err);
    }
};

exports.deleteArticle = async ctx => {
    try {
        await del([`${config.imagePath}/${ctx.request.body.title}`], {
            force: true
        });
        await Article.removeArticle({
            title: ctx.request.body.title
        });
        ctx.response.body = 1;
    } catch (err) {
        console.log(err);
    }
};

exports.getArticles = async ctx => {
    try {
        let regex = new RegExp(ctx.request.body.search || "", "gi");
        let tag = new Array(1);
        tag.push(ctx.request.body.search || "");
        let page = ctx.request.body.currentPage || 1;
        let articles = await Article.getArticle({ query: { $or: [{ title: { $regex: regex } }, { content: { $regex: regex } }, { tags: { $in: tag } }] }, limit: 10, skip: (page - 1) * 10, sort: { time: 1 } });
        let count = await Article.getCount({$or: [{title: {$regex: regex}},{content: {$regex: regex}},{tags: {$in: tag}}]});
        ctx.response.type = "application/json";
        ctx.response.body = {
            articles: articles,
            count: count
        };
    } catch (err) {
        console.log(err);
    }
};

exports.clearUnusedImage = async ctx => {
    try {
        let imageArray = await async_fs.readdir(`${config.imagePath}/${ctx.request.body.title}`);
        if (imageArray.toString() !== ctx.request.body.imageArray.toString()) {
            imageArray.forEach(async (el, index, input) => {
                if (!ctx.request.body.imageArray.includes(el)) {
                    await async_fs.unlink(`${config.imagePath}/${ctx.request.body.title}/${el}`);
                }
            });
        }
        ctx.response.body = 1;
    } catch (err) {
        console.log(err);
    }
};
