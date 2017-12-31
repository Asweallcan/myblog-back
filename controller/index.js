const cheerio = require("cheerio");
const superagent = require("superagent");
const Article = require("../module/article.js");

require("superagent-charset")(superagent);

exports.initIndex = async ctx => {
    try {
        let movies = await getMoviesInfo(),
            games = await getGamesInfo(),
            nba = await getNbaInfo(),
            bizhi = await getBizhi(),
            articles = await Article.getArticle({
                query: {},
                query2: {title: 1, time: 1, _id: 0},
                sort: {time: -1},
                limit: 6
            });
        ctx.response.type = "application/json";
        ctx.response.body = {
            movies: movies,
            games: games,
            bizhi: bizhi,
            nba: nba,
            articles: articles
        };
    } catch (err) {
        console.log(err);
    }
};

exports.getArticleByTitle = async ctx => {
    ctx.response.type = "application/json";
    ctx.response.body = {
        article: await Article.getArticle({query: {title: ctx.request.body.title}})
    }
};

function getMoviesInfo() {
    return new Promise((resolve, reject) => {
        superagent.get("http://gaoqing.fm").end((err, content) => {
            if (err) {
                reject(err);
            }
            let $ = cheerio.load(content.text);
            let items = [];
            $(".item-list li").slice(0, 10).each((index, element) => {
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
}

function getGamesInfo() {
    return new Promise((resolve, reject) => {
        superagent.get("http://www.gamersky.com").end((err, content) => {
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
                    image: $element.find("a img").attr("src"),
                    link: $element.find("a").attr("href")
                });
            });
            $(".Ptxt.block .li3").slice(0, 10).each((index, element) => {
                let $element = $(element);
                data.gameNews.push({
                    title: $element.find("a").text(),
                    link: $element.find("a").attr("href")
                });
            });
            resolve(data);
        });
    });
}

function getBizhi() {
    return new Promise((resolve, reject) => {
        superagent.get("http://www.gamersky.com/ent/wp").end((err, content) => {
            if (err) {
                reject(err);
            }
            let $ = cheerio.load(content.text);
            let items = [];
            $(".Mid2_L li").slice(0, 3).each((index, element) => {
                let $element = $(element);
                items.push({
                    title: $element.find(".con .tit").text(),
                    image: $element.find(".img a img").attr("src"),
                    link: $element.find(".img a").attr("href"),
                    time : $element.find(".con .tme2 .time").text()
                })
            });
            resolve(items)
        })
    })
}

async function getNbaInfo() {
    return new Promise(async (resolve, reject) => {
        try {
            let nbaNews = await getNBAnews();
            let nbaImage = await getNBAimg();
            resolve({
                nbaSlide: nbaImage.slide,
                nbaRec: nbaImage.rec,
                nbaNews: nbaNews
            })
        } catch (err) {
            reject(err)
        }
    })
}

function getNBAimg() {
    return new Promise((resolve, reject) => {
        superagent.get("http://sports.qq.com/nba").charset("GBK").end((err, content) => {
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
            $(".lookb .pic-item a").each((index, element) => {
                let $element = $(element);
                nba.rec.push({
                    title: $element.find("p").text(),
                    image: $element.find("img").attr("src"),
                    link: $element.attr("href")
                })
            });
            resolve(nba)
        });
    });
}

function getNBAnews() {
    return new Promise((resolve, reject) => {
        superagent.get("https://nba.hupu.com/").end((err, content) => {
            if (err) {
                reject(err);
            }
            let $ = cheerio.load(content.text);
            let items = [];
            $(".bestNews .nba-latestNews ul li").each((index, element) => {
                let $element = $(element);
                items.push({
                    title: $element.find("a").text(),
                    link: $element.find("a").attr("href")
                })
            });
            resolve(items);
        })
    })
}

function exclude(text, arr) {
    for (let exc of arr) {
        if (text.indexOf(exc) > -1) {
            return true;
        }
    }
}