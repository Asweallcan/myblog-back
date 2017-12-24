const mongoose = require("../mongoose_helper.js").mongoose;

const adminSchema = new mongoose.Schema({
    username: {
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

module.exports = mongoose.model("admin", adminSchema);