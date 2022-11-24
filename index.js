require('dotenv').config();
const Koa = require("koa");
const app = new Koa();
const port = process.env.PORT || 8000;
const cors = require("@koa/cors");
const proxy = require('koa-proxies') // maybe state of the art



// https://thewebdev.info/2020/07/21/sending-response-with-koa/
// const Koa = require('koa');
// const app = new Koa();
//
// app.use(async (ctx, next) => {
//     ctx.set('Access-Control-Allow-Origin', '*');
//     ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
//     ctx.body = 'hello';
// });
//
// app.listen(3000);


//const fs = require('fs');
// benutze fs für die bearbeitung der Datei




// https://www.auto-motor-und-sport.de/thenewsbar/static/pw.js
// https://pw.thenewsbar.net/static/pw.js


app.use(cors())

// path url beeinflusst destination

// get string lesen und danach das Target richten

app.use(proxy('/thenewsbar/static/pw.js', {
    target: 'https://www.auto-motor-und-sport.de',
    changeOrigin: true
}))

app.listen(port, function () {
    console.log(`listening on port ${port}`);
})