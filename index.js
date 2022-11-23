const Koa = require("koa");
const app = new Koa();

// https://github.com/edorivai/koa-proxy

var proxy = require('koa-proxy');

app.use(proxy({
    host: 'http://google.de'
}));
app.listen(8000);