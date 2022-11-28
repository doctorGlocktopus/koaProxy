require('dotenv').config();
const cors = require("@koa/cors");
const Koa = require("koa");
const app = new Koa();
const port = process.env.PORT;

app.use(cors())

let value = "https://www.auto-motor-und-sport.de"

app.use(async (ctx) => {

    //let value = ctx.host

    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    try {
        let plane = await fetch(value + '/thenewsbar/static/pw.js')
        let text = await plane.text()
        ctx.body = text.replace(value + '/thenewsbar', "https://pw.thenewsbar.net").replace(value + '/metricsthenewsbar/metrics/', "https://pw.thenewsbar.net/static/pw.js")
    } catch (e) {
        return e.message()
    }
});

// const proxy = require('koa-proxies');
// let plane = await fetch(value + '/thenewsbar/static/pw.js')
// await plane.replace(value + '/thenewsbar',"https://pw.thenewsbar.net")
// await plane.replace(value + '/metricsthenewsbar/metrics/',"https://pw.thenewsbar.net/static/pw.js")

// app.use(proxy('/thenewsbar/static/pw.js', {
//     // jetzt reinlesen in die Datei und eine Ausgabe definieren
//     target: 'https://www.auto-motor-und-sport.de',
//     changeOrigin: true
// }))


app.listen(port, function () {
    console.log(`listening on port ${port}`);
})