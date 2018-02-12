/*
 * @Author: lvshihao
 * @Date: 2018-02-04 10:16:48
 * @Last Modified by: lvshihao
 * @Last Modified time: 2018-02-12 09:37:56
 */
// import { Promise } from "mongoose";

const Movie = require("../module/movie");
const busboy = require("koa-busboy");
const config = require("../config");
const async_fs = require("async-file");
const gm = require("gm");
const path = require("path");
const del = require("del");

exports.getMovies = async(ctx, next) => {
    try {
        const {conditions} = ctx.request.body;
        const movies = await Movie.Find({
            conditions,
            projections: {
                __v: 0
            },
            options: {}
        });
        const result = [];
        for (let i = 0, element; element = movies[i++];) {
            let imageName = [];
            if (await async_fs.exists(`${config.movieImagePath}/${element._id}`)) {
                imageName = await async_fs.readdir(`${config.movieImagePath}/${element._id}`);
            }
            result.push({
                ...element._doc,
                imageName: imageName.length
                    ? imageName[0]
                    : ""
            });
        }
        ctx.response.type = "application/json";
        ctx.response.body = result;
    } catch (err) {
        throw new Error(err);
    }
}

exports.create = async(ctx, next) => {
    try {
        let {
            id,
            title,
            stars,
            director,
            rate,
            description
        } = ctx.request.body;
        stars = stars.split("/");
        let result;
        if (!id) {
            result = await Movie.Create({
                doc: {
                    title,
                    stars,
                    director,
                    rate,
                    description
                }
            });
        } else {
            result = await Movie.Update({
                conditions: {
                    _id: id
                },
                doc: {
                    title,
                    stars,
                    director,
                    rate,
                    description
                }
            });
        }
        if (result._id) {
            ctx.response.body = result._id;
        } else {
            ctx.response.body = 1;
        }
    } catch (err) {
        ctx.response.body = -1;
        throw new Error(err);
    }
};

exports.delete = async ctx => {
    try {
        if (await async_fs.exists(`${config.movieImagePath}/${ctx.request.body.id}`)) {
            await del([`${config.movieImagePath}/${ctx.request.body.id}`], {force: "true"});
        }
        await Movie.Remove({
            conditions: {
                _id: ctx.request.body.id
            }
        });
        ctx.response.body = 1;
    } catch (err) {
        ctx.response.body = -1;
        throw new Error(err);
    }
}

let imageName;

exports.uploader = busboy({
    dest: `${config.movieImagePath}/temp`,
    fnDestFilename: (fieldname, filename) => {
        imageName = String(new Date().getTime() + Math.floor(Math.random() * 100)) + path.extname(filename);
        return imageName;
    }
});

exports.uploadImage = async(ctx, next) => {
    try {
        await next();
        const extname = path.extname(imageName);
        ctx.response.body = `/movies/${ctx.request.body.id}/${ctx.request.body.id}${extname}`;
    } catch (err) {
        throw new Error(err);
    }
};

exports.uploadImageNext = async ctx => {
    return new Promise(async(resolve, reject) => {
        try {
            const oldpath = `${config.movieImagePath}/temp/${imageName}`;
            const extname = path.extname(imageName);
            if (!await async_fs.exists(`${config.movieImagePath}/${ctx.request.body.id}`)) {
                await async_fs.mkdir(`${config.movieImagePath}/${ctx.request.body.id}`);
            }
            const newpath = `${config.movieImagePath}/${ctx.request.body.id}/${ctx.request.body.id}${extname}`;
            await async_fs.rename(oldpath, newpath);
            gm(newpath)
                .resize(null, 230, ">")
                .write(newpath, err => {
                    if (err) 
                        reject(err);
                    resolve(1);
                })
        } catch (err) {
            reject(err);
        }
    })
};