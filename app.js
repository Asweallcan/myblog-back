const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const session = require("koa-session2");
const Store = require("./store.js");
const cors = require("kcors");
const favicon = require("koa-favicon");

//router
const admin = require('./routes/admin.js');
const article = require("./routes/article.js");
const index = require("./routes/index.js");

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));
app.use(require("koa-static")(__dirname + '/views'));
app.use(session({store: new Store()}));
app.use(cors());
app.use(views(__dirname + '/views', {html:'underscore'}));
app.use(favicon(__dirname+"/public/images/favicon.jpeg"));

// logger
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
});

// routes
app.use(admin.routes(), admin.allowedMethods());
app.use(article.routes(), admin.allowedMethods());
app.use(index.routes(), index.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});
app.listen(8088);
module.exports = app;
