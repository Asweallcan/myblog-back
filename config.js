const produciton = true;

module.exports = {
    articleImagePath: "./public/articles",
    backgroundImagePath: "./public/backgrounds",
    backgroundSamllImagePath: "./public/backgrounds/small",
    movieImagePath: "./public/movies",
    urlPath: produciton
        ? "http://server.lvshihaonb.cn"
        : "http://localhost:8088"
};