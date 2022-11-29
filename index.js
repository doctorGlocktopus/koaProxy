require('dotenv').config();
const cors = require("@koa/cors");
const Koa = require("koa");
const app = new Koa();
const port = process.env.PORT;

app.use(cors())

const PATH_DOMAIN_MAP = {
    "ams": {
        url: "https://www.auto-motor-und-sport.de",
        suffixFile:'/thenewsbar/static/pw.js',
        suffix:'/thenewsbar'
    },
    'googleAnalytics': {
        url: "www.google-analytics.com",
        fullUrl: "https://www.google-analytics.com",
        suffix: "/gtm/js?id=",
        suffixFile: "/analytics.js",
        strangeString: '"https://www.google-analytics.com/debug/bootstrap?id="+a.get(Na)+"&src=LEGACY&cond="+b'
    },
    "googleAdd": {
        url: "www.googletagmanager.com",
        fullUrl: "https://www.googletagmanager.com",
        suffix: "/gtm.js?id=GTM-P9H4MZM",
        strangeString: '"https://www.googletagmanager.com/a?id="+Qg.M+"&cv=266",Yh={label:Qg.M+"',
    },
    'thenewsbar': {
        name: "thenewsbar",
        url: "https://pw.thenewsbar.net",
        suffixFile:'/static/pw.js',
        suffix:'/thenewsbar'
    },
};


app.use(async (ctx, next) => {

    ctx.set('Access-Control-Allow-Credentials');
    ctx.set('Access-Control-Allow-Origin', '*'); // the start allows all Origins
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');

    switch (ctx.host) {

        //case "localhost:8000":

        case PATH_DOMAIN_MAP.ams:
            let ams = PATH_DOMAIN_MAP.ams
            await blend(ams.url, ams.suffixFile, ams.suffix)
            break;

        case PATH_DOMAIN_MAP.googleAdd.fullUrl:
            let googleAdd = PATH_DOMAIN_MAP.googleAdd
            await blend(googleAdd.fullUrl, googleAdd.suffix, googleAdd.url, googleAdd.strangeString)
            break;

        case "localhost:8000":
        // case PATH_DOMAIN_MAP.googleAnalytics.url:
            let googleAnalytics = PATH_DOMAIN_MAP.googleAnalytics
            await blend(googleAnalytics.fullUrl, googleAnalytics.suffixFile, googleAnalytics.suffix, googleAnalytics.strangeString, googleAnalytics.url)
            break;

        default:
            break;
    }

    async function blend(fullUrl, suffixFile, suffix, strangeString, url) {

        let thenewsbar = PATH_DOMAIN_MAP.thenewsbar

        try {
            let plane = await fetch(fullUrl + suffixFile)
            let text = await plane.text()

            if(fullUrl == PATH_DOMAIN_MAP.googleAdd.fullUrl) {
                ctx.body = text
                    .replace(suffix, thenewsbar.url)
                    .replace(strangeString, thenewsbar.url + thenewsbar.suffixFile)
                return next()
            }
            if(fullUrl == PATH_DOMAIN_MAP.ams.url) {
                ctx.body = text
                    .replace(fullUrl + suffix, thenewsbar.url)
                    .replace(fullUrl, thenewsbar.url)
                return next()
            }
            if(fullUrl == PATH_DOMAIN_MAP.googleAnalytics.fullUrl) {
                ctx.body = text
                    .replace(fullUrl + suffix, thenewsbar.url)
                    .replace(suffixFile, thenewsbar.url)
                    .replace("google-analytics", thenewsbar.name)   //createPolicy("google-analytics"
                    .replace("//" + url, thenewsbar.url)
                    .replace(strangeString, thenewsbar.url + thenewsbar.suffixFile)
                    .replace(url, thenewsbar.url)
                    .replace("GoogleAnalyticsObject", "")// googleAnalyticsObject ???
                return next()
            }
        } catch (e) {
            return e.message()
        }
    }
});

app.listen(port, function () {
    console.log(`listening on port ${port}`);
    return
})