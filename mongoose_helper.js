//避免多次链接mongodb，所以单独一个文件传出mongoose的实例
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/myblog", {useMongoClient: true});
exports.mongoose = mongoose;
