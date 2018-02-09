const produciton = true;

module.exports = {
    articleImagePath: "./public/articles",
    backgroundImagePath: "./public/backgrounds",
    backgroundSamllImagePath: "./public/backgrounds/small",
    movieImagePath: "./public/movies",
    urlPath: produciton
        ? "http://localhost:8088"
        : "http://server.lvshihaonb.cn"
};