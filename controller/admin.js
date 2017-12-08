const Admin = require("../module/admin.js");
const config = require(__dirname+"/../config.js");
const crypto = require("crypto"); //加密模块
const busboy = require("koa-busboy");
const path = require("path");
const gm = require("gm");
const async_fs = require("async-file");
const fs = require("fs");

var avatarName;
exports.uploader = busboy({
    dest:  `${config.imagePath}/temp`,
    fnDestFilename: (fieldname, filename) => {
        avatarName = String(new Date().getTime() + Math.floor(Math.random() * 100)) + path.extname(filename);
        return avatarName;
    }
});

exports.login = async ctx => {
    try {
        let user = await Admin.getAdmin({
            username: ctx.request.body.username,
            password: _md5(ctx.request.body.password)
        });
        if (!user) {   //如果查找用户不存在
            ctx.response.body = -1;
            return
        }
        ctx.session.admin = ctx.request.body.username;
        ctx.response.body = 1;
    } catch (err) {
        ctx.response.body = -2;
        console.log(err)
    }
};

exports.initAvatar = async ctx => {
    let imgarr = await async_fs.readdir(`${config.imagePath}/avatar`);
    ctx.response.type = "application/json";
    ctx.response.body = {avatarUrl: `${config.urlPath}/images/avatar/${imgarr[imgarr.length - 1]}`}
};

exports.uploadAvatar = async (ctx, next) => {
    try {
        await next();
        ctx.response.type = "application/json";
        ctx.response.body = {avatarUrl: `${config.urlPath}/images/temp/${avatarName}`};
    } catch (err) {
        console.log(err)
    }
};
exports.uploadAvatarNext = () => {
    return new Promise((resolve, reject) => {
        gm(`${config.imagePath}/temp/${avatarName}`).resize(800, ">").write(`${config.imagePath}/temp/${avatarName}`, err => {
            if (err) {
                reject(err);
            }
            resolve(1)
        });
    })
};

exports.cropAvatar = async (ctx, next) => {
    try {
        next();
        ctx.response.type = "application/json";
        ctx.response.body = {avatarUrl: `${config.urlPath}/images/avatar/${ctx.session.admin + path.extname(avatarName)}`}
    } catch (err) {
        console.log(err)
    }
};
exports.cropAvatarNext = (ctx, next) => {
    let crop = ctx.request.body.cropinfo;
    let dir = `${config.imagePath}/temp/${avatarName}`;
    gm(dir).crop(crop.w, crop.h, crop.x, crop.y).resize(200, 200, "!").write(`${config.imagePath}/avatar/${ctx.session.admin + path.extname(avatarName)}`, err => {
        if (err) {
            console.log(err);
        }
        next();
    })
};
exports.cropAvatarFinal = async () => {
    try {
        let arr = await async_fs.readdir(`${config.imagePath}/temp`);
        arr.forEach(async (el) => {
            await async_fs.unlink(`${config.imagePath}/temp/${el}`)
        });
    } catch (err) {
        console.log(err);
    }
};


function _md5(password) { //md5加密密码
    return crypto.createHash("md5").update(password).digest("base64")
}
