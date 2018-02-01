/*
 * @Author: lvshihao
 * @Date: 2018-01-29 08:54:49
 * @Last Modified by: lvshihao
 * @Last Modified time: 2018-01-31 21:25:38
 */
const Admin = require("../module/admin.js");
const crypto = require("crypto"); //加密模块
const inviteCode = _md5("gamersky.com1");

exports.login = async ctx => {
    try {
        let admin = await Admin.getAdmin({username: ctx.request.body.username});
        if (!admin) { //如果查找用户不存在
            ctx.response.body = -1;
            return false;
        }
        if (admin.password !== _md5(ctx.request.body.password)) { //密码错误
            ctx.response.body = -2;
            return false;
        }
        ctx.response.body = {
            username: admin.username,
            nickname: admin.nickname,
            password: admin.password
        };
    } catch (err) {
        ctx.response.body = -3;
        throw new Error(err);
    }
};

exports.regist = async ctx => {
    try {
        if (inviteCode !== _md5(ctx.request.body.inviteCode)) {
            ctx.response.body = -1;
            return false;
        }
        let admin = await Admin.getAdmin({username: ctx.request.body.username});
        if (admin) {
            ctx.response.body = -2;
            return false;
        }
        await Admin.insertAdmin({
            username: ctx.request.body.username,
            password: _md5(ctx.request.body.password)
        });
        ctx.response.body = 1;
    } catch (err) {
        ctx.response.body = -3;
        throw new Error(err);
    }
}

exports.update = async ctx => {
    try{
        await Admin.updateAdmin(ctx.request.body);
        ctx.response.body = 1;
    }catch(err){
        ctx.response.body = -1;
        throw new Error(err);
    }
}

function _md5(password) { //md5加密密码
    return crypto
        .createHash("md5")
        .update(password)
        .digest("base64");
}

/*
取消头像上传
const config = require(__dirname + "/../config.js");
const busboy = require("koa-busboy");
const path = require("path");
const gm = require("gm");
const async_fs = require("async-file");
var avatarName;
exports.uploader = busboy({
    dest: `${config.imagePath}/temp`,
    fnDestFilename: (fieldname, filename) => {
        avatarName = String(new Date().getTime() + Math.floor(Math.random() * 100)) + path.extname(filename);
        return avatarName;
    }
});
取消爬虫
exports.initAvatar = async ctx => {
    let imgarr = await async_fs.readdir(`${config.imagePath}/avatar`);
    ctx.response.type = "application/json";
    ctx.response.body = {
        avatarUrl: `${config.urlPath}/images/avatar/${imgarr[imgarr.length - 1]}`
    }
};

exports.uploadAvatar = async(ctx, next) => {
    try {
        await next();
        ctx.response.type = "application/json";
        ctx.response.body = {
            avatarUrl: `${config.urlPath}/images/temp/${avatarName}`
        };
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

exports.cropAvatar = async(ctx, next) => {
    try {
        next();
        ctx.response.type = "application/json";
        ctx.response.body = {
            avatarUrl: `${config.urlPath}/images/avatar/${ctx.session.admin + path.extname(avatarName)}`
        }
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
exports.cropAvatarFinal = async() => {
    try {
        let arr = await async_fs.readdir(`${config.imagePath}/temp`);
        arr.forEach(async(el) => {
            await async_fs.unlink(`${config.imagePath}/temp/${el}`)
        });
    } catch (err) {
        console.log(err);
    }
};
*/