const cheerio = require("cheerio");
const superagent = require("superagent");
const Article = require("../module/article.js");
require("superagent-charset")(superagent);


exports.getArticleByTitle = async ctx => {
    ctx.response.type = "application/json";
    ctx.response.body = {
        article: await Article.getArticle({query: {title: ctx.request.body.title}})
    };
};

exports.getArticle = async ctx => {
    try {
        let articles = await Article.getArticle({
            query: {},
            query2: {title: 1, time: 1, _id: 0},
            sort: {time: -1},
            limit: 6
        });
        ctx.response.type = "application/json";
        ctx.response.body = {
            articles: articles
        };
    } catch (err) {
        console.log(err);
    }
};

exports.getMoviesInfo = async (ctx, next) => {
    try {
        let movie = await next();
        ctx.response.type = "application/json";
        ctx.response.body = {
            movie: movie
        }
    } catch (err) {
        console.log(err)
    }
};

exports.getMoviesInfoNext = () => {
    return new Promise((resolve, reject) => {
        superagent.get("http://gaoqing.fm").end((err, content) => {
            if (err) {
                reject(err);
            }
            let $ = cheerio.load(content.text);
            let items = [];
            $(".item-list li")
                .slice(0, 10)
                .each((index, element) => {
                    let $element = $(element);
                    items.push({
                        title: $element.find(".item-desc a").text(),
                        rate: $element.find(".item-desc span").text(),
                        image: $element.find("#indeximg img").attr("src"),
                        link: $element.find(".item-desc a").attr("href")
                    });
                });
            resolve(items);
        });
    });
};

exports.getGamesInfo = async (ctx, next) => {
    try {
        let game = await next();
        ctx.response.type = "application/json";
        ctx.response.body = {
            game: game
        }
    } catch (err) {
        console.log(err)
    }
};

exports.getGamesInfoNext = () => {
    return new Promise((resolve, reject) => {
        superagent
            .get("http://www.gamersky.com")
            .end((err, content) => {
                if (err) {
                    reject(err);
                }
                let $ = cheerio.load(content.text);
                let data = {
                    gameSlide: [],
                    gameNews: []
                };
                $(".Bimg li").each((index, element) => {
                    let $element = $(element);
                    data.gameSlide.push({
                        title: $element.find("a").attr("title"),
                        link: $element.find("a").attr("href")
                    });
                });
                $(".Ptxt.block .li3")
                    .slice(0, 10)
                    .each((index, element) => {
                        let $element = $(element);
                        data.gameNews.push({
                            title: $element.find("a").text(),
                            link: $element.find("a").attr("href")
                        });
                    });
                let dataResolve = data.gameSlide.concat(data.gameNews);
                resolve(dataResolve);
            });
    });
};

exports.getBizhi = async (ctx, next) => {
    try {
        let bizhi = await next();
        ctx.response.type = "application/json";
        ctx.response.body = {
            bizhi: bizhi
        }
    } catch (err) {
        console.log(err)
    }
};

exports.getBizhiNext = () => {
    return new Promise((resolve, reject) => {
        superagent.get("http://www.gamersky.com/ent/wp").end((err, content) => {
            if (err) {
                reject(err);
            }
            let $ = cheerio.load(content.text);
            let items = [];
            $(".Mid2_L li")
                .slice(0, 5)
                .each((index, element) => {
                    let $element = $(element);
                    items.push({
                        title: $element.find(".con .tit").text(),
                        link: "http://www.gamersky.com/" + $element.find(".img a").attr("href"),
                        time: $element.find(".con .tme2 .time").text()
                    });
                });
            resolve(items);
        });
    });
};

exports.getNBAimg = async (ctx, next) => {
    try {
        let nbaImg = await next();
        ctx.response.type = "application/json";
        ctx.response.body = {
            nbaimg: nbaImg
        }
    } catch (err) {
        console.log(err)
    }
};

exports.getNBAimgNext = () => {
    return new Promise((resolve, reject) => {
        superagent
            .get("http://sports.qq.com/nba")
            .charset("GBK")
            .end((err, content) => {
                if (err) {
                    reject(err);
                }
                let $ = cheerio.load(content.text);
                let nba = {
                    slide: [],
                    rec: []
                };
                $(".slide-wrap .col-2 a").each((index, element) => {
                    let $element = $(element);
                    if (!exclude($element.find("p").text(), ["毛豆", "哈德森", "瓜子", "手游"])) {
                        nba.slide.push({
                            title: $element.find("p").text(),
                            image: $element.find("img").attr("src"),
                            link: $element.attr("href")
                        });
                    }
                });
                $("#eFocusCont .lookb.cf .pic-item a")
                    .slice(0, 4)
                    .each((index, element) => {
                        let $element = $(element);
                        nba.rec.push({
                            title: $element.find("p span").text(),
                            image: $element.find("img").attr("src"),
                            link: $element.attr("href")
                        });
                    });
                resolve(nba);
            });
    });
};

exports.getNBAnews = async (ctx, next) => {
    try {
        let nbaNews = await next();
        ctx.response.type = "application/json";
        ctx.response.body = {
            nbanews: nbaNews
        }
    } catch (err) {
        console.log(err)
    }
};

exports.getNBAnewsNext = () => {
    return new Promise((resolve, reject) => {
        superagent.get("https://voice.hupu.com/nba").end((err, content) => {
            if (err) {
                reject(err);
            }
            let $ = cheerio.load(content.text);
            let items = [];
            $(".news-list ul li .list-hd a")
                .slice(0, 17)
                .each((index, element) => {
                    let $element = $(element);
                    items.push({
                        title: $element.text(),
                        link: $element.attr("href")
                    });
                });
            resolve(items);
        });
    });
};

function exclude(text, arr) {
    for (let exc of arr) {
        if (text.indexOf(exc) > -1) {
            return true;
        }
    }
}
