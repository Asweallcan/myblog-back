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
                query2: { title: 1, time: 1, _id: 0 },
                sort: { time: -1 },
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
        article: await Article.getArticle({ query: { title: ctx.request.body.title } })
    };
};

function getMoviesInfo() {
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
}

function getGamesInfo() {
    return new Promise((resolve, reject) => {
        superagent
            .get("http://www.gamersky.com")
            // .set("Cookie",{
            //     "Cookieheibai" : "bai",
            //     "Hm_lvt_dcb5060fba0123ff56d253331f28db6a" : ["1514867662","1514868621","1514965993","1514979300"],
            //     "UM_distinctid" : "160549230e23a8-0cf0d0ee863393-5b452a1d-144000-160549230e3753"
            // })
            // .set("User-Agent","Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36")
            // .set("Host","gamersky.com")
            // .set("Referer","http://http://image.gamersky.com/")
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
}

function getBizhi() {
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
                        link: "http://www.gamersky.com/"+$element.find(".img a").attr("href"),
                        time: $element.find(".con .tme2 .time").text()
                    });
                });
            resolve(items);
        });
    });
}

function getNBAimg() {
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
}

function getNBAnews() {
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
            });
        } catch (err) {
            reject(err);
        }
    });
}

function exclude(text, arr) {
    for (let exc of arr) {
        if (text.indexOf(exc) > -1) {
            return true;
        }
    }
}
