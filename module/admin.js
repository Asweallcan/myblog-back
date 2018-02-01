/*
 * @Author: lvshihao
 * @Date: 2018-01-30 08:45:22
 * @Last Modified by: lvshihao
 * @Last Modified time: 2018-01-30 13:43:37
 */
const mongoose = require("../mongoose_helper.js").mongoose;

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        default: ""
    },
    nickname: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        default: ""
    }
});

adminSchema.statics.getAdmin = function (user) {
    return new Promise((resolve, reject) => {
        this.findOne(user, (err, result) => {
            if (err) {
                reject(err)
            }
            resolve(result)
        })
    })
};

adminSchema.statics.insertAdmin = function (user) {
    return new Promise((resolve, reject) => {
        this.create(user, (err, result) => {
            if (err) {
                resolve(err);
            }
            resolve(1);
        })
    })
}

adminSchema.statics.deleteAdmin = function (user) {
    return new Promise((resolve, reject) => {
        this.remove(user, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(1);
        })
    })
}

adminSchema.statics.updateAdmin = function(user){
    return new Promise((resolve,reject)=>{
        this.update({username:user.username},user,(err,result)=>{
            if(err){
                reject(err);
            }
            resolve(1);
        })
    })
}

module.exports = mongoose.model("admin", adminSchema);