/*
 * @Author: lvshihao
 * @Date: 2018-01-29 08:54:49
 * @Last Modified by: lvshihao
 * @Last Modified time: 2018-02-02 17:37:13
 */
const Admin = require("../module/admin.js");
const crypto = require("crypto"); //加密模块
const inviteCode = _md5("gamersky.com1");
const async_fs = require("async-file");
const path = require("path");
const gm = require("gm");
const busboy = require("koa-busboy");
const config = require(__dirname + "/../config.js");

exports.login = async ctx => {
    try {
        let admin = await Admin.Find({
            conditions: {
                username: ctx.request.body.username
            },
            projections: {
                _id: 0,
                __v:0
            },
            options: {}
        });
        if (!admin.length) { //如果查找用户不存在
            ctx.response.body = -1;
            return false;
        }
        if (admin[0].password !== _md5(ctx.request.body.password)) { //密码错误
            ctx.response.body = -2;
            return false;
        }
        ctx.response.body = admin[0];
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
        let admin = await Admin.Count({
            conditions: {
                username: ctx.request.body.username
            }
        });
        if (admin) {
            ctx.response.body = -2;
            return false;
        }
        await Admin.Create({
            doc: {
                username: ctx.request.body.username,
                password: _md5(ctx.request.body.password)
            }
        });
        ctx.response.body = 1;
    } catch (err) {
        ctx.response.body = -3;
        throw new Error(err);
    }
}

exports.update = async ctx => {
    try {
        await Admin.Update({
            conditions: {
                username: ctx.request.body.username
            },
            doc: ctx.request.body,
            options: {}
        });
        ctx.response.body = 1;
    } catch (err) {
        ctx.response.body = -1;
        throw new Error(err);
    }
}

exports.backgrounds = async ctx => {
    const files = await async_fs.readdir(config.backgroundImagePath);
    files.splice(files.indexOf("temp"), 1);
    files.splice(files.indexOf("small"), 1);
    ctx.response.body = files;
}

var imageName;

exports.uploader = busboy({
    dest: `${config.backgroundImagePath}/temp`,
    fnDestFilename: (fieldname, filename) => {
        imageName = String(new Date().getTime() + Math.floor(Math.random() * 100)) + path.extname(filename);
        return imageName;
    }
})

exports.uploadImage = async(ctx, next) => {
    try {
        await next();
        ctx.response.body = 1;
    } catch (err) {
        ctx.response.body = -1;
        throw new Error(err);
    }
}

exports.uploadImageNext = async ctx => {
    return new Promise(async(resolve, reject) => {
        try {
            const oldpath = `${config.backgroundImagePath}/temp/${imageName}`;
            const newpath = `${config.backgroundImagePath}/${imageName}`;
            await async_fs.rename(oldpath, newpath);
            const file = await async_fs.stat(newpath);
            const size = file.size;
            const percent = Math.floor((200 / size) * 100);
            if (size > 200) {
                gm(newpath)
                    .quality(percent)
                    .write(newpath, err => {
                        if (err) 
                            reject(err);
                        gm(newpath)
                            .resize(null, 230, ">")
                            .write(`${config.backgroundImagePath}/small/${imageName}`, err => {
                                if (err) 
                                    reject(err);
                                resolve(1);
                            })
                    });
            } else {
                gm(newpath)
                    .resize(null, 230, ">")
                    .write(`${config.backgroundImagePath}/small/${imageName}`, err => {
                        if (err) 
                            return reject(err);
                        resolve(1);
                    })
            }
        } catch (err) {
            reject(err);
        }
    })
}

exports.deleteImage = async(ctx, next) => {
    try {
        const data = ctx.request.body.filename;
        const arr = data.split("/");
        const filename = arr[arr.length - 1];
        await async_fs.unlink(`${config.backgroundImagePath}/${filename}`);
        await async_fs.unlink(`${config.backgroundImagePath}/small/${filename}`);
        ctx.response.body = 1;
    } catch (err) {
        ctx.response = -1;
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