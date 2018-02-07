const mongoose = require("../mongoose_helper.js").mongoose;
const articleSchema = new mongoose.Schema({
    title: String,
    tags: Array,
    time: {
        type: String,
        default: new Date().getTime()
    },
    content: String,
    author: String,
    description: String,
    comments: [
        {
            username: String,
            content: String,
            time: {
                type: String,
                default: new Date().getTime()
            }
        }
    ]
});

articleSchema.statics.Create = function (params) {
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

articleSchema.statics.Find = function (params) {
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

articleSchema.statics.Update = function (params) {
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

articleSchema.statics.Remove = function (params) {
    const {conditions} = params;
    return new Promise((resolve, reject) => {
        this.remove(conditions, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        })
    })
};

articleSchema.statics.Count = function (params) {
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

module.exports = mongoose.model("article", articleSchema);