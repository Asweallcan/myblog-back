const mongoose = require("../mongoose_helper.js").mongoose;

const articleSchema = new mongoose.Schema({
    title: {
        type:String,
        default:""
    },
    tags: {
        type:Array,
        default:[]
    },
    time: {
        type: String,
        default: new Date().getTime(),
    },
    content: {
        type:String,
        default:""
    }
});

articleSchema.statics.getArticle = function (article) {
    let query = article.query || {},
        query2 = article.query2 || {},
        skip = article.skip || 0,
        limit = article.limit || 0,
        sort = article.sort || {};
    return new Promise((resolve, reject) => {
        this.find(query, query2, {sort: sort,skip: skip, limit: limit}, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        })
    })
};

articleSchema.statics.getCount = function (article) {
    return new Promise((resolve, reject) => {
        this.count(article, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        })
    })
};

articleSchema.statics.saveArticle = function (article) {
    return new Promise((resolve, reject) => {
        this.create(article, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(1);
        })
    })
};

articleSchema.statics.removeArticle = function (article) {
    return new Promise((resolve, reject) => {
        this.remove(article, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(1);
        })
    })
};

module.exports = mongoose.model("article", articleSchema);