require('dotenv').config();
const Koa = require("koa");
const app = new Koa();
const port = process.env.PORT || 8000;
const cors = require("@koa/cors");
const proxy = require('koa-proxy');

// https://www.auto-motor-und-sport.de/thenewsbar/static/pw.js
// https://pw.thenewsbar.net/static/pw.js
// https://github.com/edorivai/koa-proxy


app.use(cors())
app.use(proxy({
    host: 'http://google.de'
}));
app.listen(port, function () {
    console.log(`listening on port ${port}`);
})