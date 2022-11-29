require('dotenv').config();
const cors = require("@koa/cors");
const Koa = require("koa");
const app = new Koa();
const port = process.env.PORT;

app.use(cors())

// erster Schritt


const PATH_DOMAIN_MAP = {
    "ams": {
        fullUrl: "https://www.auto-motor-und-sport.de",
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
        suffixFile: "/gtm.js?id=GTM-P9H4MZM",
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
    switch (ctx.host) {

        case PATH_DOMAIN_MAP.ams:
            await blend(PATH_DOMAIN_MAP.ams)
            break;
        case "localhost:8000":
        // case PATH_DOMAIN_MAP.googleAdd.fullUrl:
            await blend(PATH_DOMAIN_MAP.googleAdd)
            break;
        case PATH_DOMAIN_MAP.googleAnalytics.url:
            await blend(PATH_DOMAIN_MAP.googleAnalytics)
            break;
        default:
            break;
    }
async function blend(props) {

        let thenewsbar = PATH_DOMAIN_MAP.thenewsbar

        try {

            if(props.fullUrl === PATH_DOMAIN_MAP.ams.fullUrl) {
                let plane = await fetch(props.fullUrl + props.suffixFile)
                let text = await plane.text()
                ctx.body = text
                    .replace(props.fullUrl + props.suffix, thenewsbar.url)
                    .replace(props.fullUrl, thenewsbar.url)
                return next()
            }

            if(props.fullUrl === PATH_DOMAIN_MAP.googleAdd.fullUrl) {
                console.log(props.suffixFile)
                console.log(props.strangeString)

                let plane = await fetch(props.fullUrl + props.suffixFile)
                // header von der request benutzen
                console.log(plane.headers)
                let text = await plane.text()
                ctx.body = text
                    .replace(props.url, thenewsbar.url)
                    .replace(props.strangeString, thenewsbar.url + thenewsbar.suffixFile)
                return next()
            }

            if(props.fullUrl === PATH_DOMAIN_MAP.googleAnalytics.fullUrl) {
                let plane = await fetch(props.fullUrl + props.suffixFile)
                let text = await plane.text()
                ctx.body = text
                    .replace(props.fullUrl + props.suffix, thenewsbar.url)
                    .replace(props.suffixFile, thenewsbar.url)
                    .replace("google-analytics", thenewsbar.name)   //createPolicy("google-analytics"
                    .replace("//" + props.url, thenewsbar.url)
                    .replace(props.strangeString, thenewsbar.url + thenewsbar.suffixFile)
                    .replace(props.url, thenewsbar.url)
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