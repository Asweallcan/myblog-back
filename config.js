const produciton = true;

module.exports = {
    imagePath : __dirname+"/public/images",
    urlPath : produciton ? "http://111.230.230.75":"http://127.0.0.1:8088"
};