const mongoose = require("../mongoose_helper").mongoose;
const movieSchema = new mongoose.Schema({title: String, description: String, stars: Array, director: String, rate: Number});

movieSchema.statics.Create = function (params) {
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

movieSchema.statics.Find = function (params) {
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

movieSchema.statics.Update = function (params) {
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

movieSchema.statics.Remove = function (params) {
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

movieSchema.statics.Count = function (params) {
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

module.exports = mongoose.model("movie", movieSchema);