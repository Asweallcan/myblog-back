/*
 * @Author: lvshihao
 * @Date: 2018-01-30 08:45:22
 * @Last Modified by: lvshihao
 * @Last Modified time: 2018-02-02 16:43:30
 */
const mongoose = require("../mongoose_helper.js").mongoose;

const adminSchema = new mongoose.Schema({username: String, nickname: String, password: String});

adminSchema.statics.Create = function (params) {
    const {doc} = params;
    return new Promise((resolve, reject) => {
        this.create(doc, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        })
    })
};

adminSchema.statics.Find = function (params) {
    const {conditions, projections, options} = params;
    return new Promise((resolve, reject) => {
        this.find(conditions, projections, options, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        })
    })
};

adminSchema.statics.Update = function (params) {
    const {conditions, doc, options} = params;
    return new Promise((resolve, reject) => {
        this.update(conditions, doc, options, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        })
    })
};

adminSchema.statics.Count = function (params) {
    const {conditions} = params;
    return new Promise((resolve, reject) => {
        this.count(conditions, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        })
    })
};

module.exports = mongoose.model("admin", adminSchema);