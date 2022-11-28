require('dotenv').config();
const cors = require("@koa/cors");
const proxy = require('koa-proxies');
const Koa = require("koa");
const app = new Koa();
const port = process.env.PORT || 8000;

app.use(cors())

let value = "https://www.auto-motor-und-sport.de"




app.use(async (ctx, next) => {
    // let plane = await fetch(value + '/thenewsbar/static/pw.js')
    // await plane.replace(value + '/thenewsbar',"https://pw.thenewsbar.net")
    // await plane.replace(value + '/metricsthenewsbar/metrics/',"https://pw.thenewsbar.net/static/pw.js")
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    ctx.body = "sell";

    ctx.body = await fetch(value + '/thenewsbar/static/pw.js')
        .then((res)=>{
            return res.text();
        }).then((text)=>{
            let one = text.replace(value + '/thenewsbar',"https://pw.thenewsbar.net")
            let two = one.replace(value + '/metricsthenewsbar/metrics/',"https://pw.thenewsbar.net/static/pw.js")
            return two
        })
});


// app.use(proxy('/thenewsbar/static/pw.js', {
//     // jetzt reinlesen in die Datei und eine Ausgabe definieren
//     target: 'https://www.auto-motor-und-sport.de',
//     changeOrigin: true
// }))
// https://www.auto-motor-und-sport.de/thenewsbar/static/pw.js
// https://pw.thenewsbar.net/static/pw.js






app.listen(port, function () {
    console.log(`listening on port ${port}`);
})