/*
 * @Author: lvshihao
 * @Date: 2018-01-30 08:45:20
 * @Last Modified by: lvshihao
 * @Last Modified time: 2018-02-02 18:07:22
 */
const Koa = require("koa");
const app = new Koa();
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const cors = require("kcors");
const admin = require("./routes/admin.js");
const article = require("./routes/article.js");
const movie = require("./routes/movie");
const session = require("koa-session");

app.keys = ["lvshihao"];

const CONFIG = {
    key: 'koa:sess',
    /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    overwrite: true,
    /** (boolean) can overwrite or not (default true) */
    httpOnly: true,
    /** (boolean) httpOnly or not (default true) */
    signed: true,
    /** (boolean) signed or not (default true) */
    rolling: false,
    /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false,
    /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
    enableTypes: ["json", "form", "text"]
}));
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));
app.use(cors());
app.use(session(CONFIG, app));
app.use(async(ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(admin.routes(), admin.allowedMethods());
app.use(article.routes(), admin.allowedMethods());
app.use(movie.routes(), movie.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
    console.error("server error", err, ctx);
});
app.listen(8088);
