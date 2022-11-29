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
    "googleAdd": {
        url: "www.googletagmanager.com",
        fullUrl: "https://www.googletagmanager.com",
        suffixFile: "/gtm.js?id=GTM-P9H4MZM",
    },
    'googleAnalytics': {
        url: "www.google-analytics.com",
        fullUrl: "https://www.google-analytics.com",
        urlNoHost: "google-analytics",
        suffix: "/gtm/js?id=",
        suffixFile: "/analytics.js",
        object: "GoogleAnalyticsObject",
    },
    'thenewsbar': {
        name: "thenewsbar",
        url: "https://pw.thenewsbar.net",
        suffixFile:'/static/pw.js',
        suffix:'/thenewsbar'
    },
};


app.use(async (ctx, next) => {
    switch (ctx.originalUrl) {
        // AMS Auto-Motor-Sport
        case PATH_DOMAIN_MAP.ams.suffixFile:
            await blend(PATH_DOMAIN_MAP.ams)
            break;

        // www.googletagmanager.com
        case PATH_DOMAIN_MAP.googleAdd.suffixFile:
            await blend(PATH_DOMAIN_MAP.googleAdd)
            break;

        // www.google-analytics.com
        case PATH_DOMAIN_MAP.googleAnalytics.suffixFile:
            await blend(PATH_DOMAIN_MAP.googleAnalytics)
            break;
        default:
            break;
    }

async function blend(props) {
    let thenewsbar = PATH_DOMAIN_MAP.thenewsbar
    let plane = await fetch(props.fullUrl + props.suffixFile)
    let text = await plane.text()

    try {
        // AMS Auto-Motor-Sport
        if(props.fullUrl === PATH_DOMAIN_MAP.ams.fullUrl) {
            ctx.body = text
                .replace(props.fullUrl + props.suffix, thenewsbar.url)
                .replace(props.fullUrl, thenewsbar.url)
            return next()
        }

        // www.googletagmanager.com
        if(props.fullUrl === PATH_DOMAIN_MAP.googleAdd.fullUrl) {
            // // header von der request benutzen
            // //console.log(plane.headers)
            // // die Header aus plane.headers extrahieren und dann übertragen
            ctx.body = text
                .replace(props.url, thenewsbar.url)
                .replace(props.fullUrl, thenewsbar.url + thenewsbar.suffixFile)
            return next()
        }

        // www.google-analytics.com
        if(props.fullUrl === PATH_DOMAIN_MAP.googleAnalytics.fullUrl) {
            ctx.body = text
                .replace(props.fullUrl + props.suffix, thenewsbar.url)
                .replace(props.suffixFile, thenewsbar.url)
                .replace(props.urlNoHost, thenewsbar.name)   //createPolicy("google-analytics"
                .replace("//" + props.url, thenewsbar.url)
                .replace(props.fullUrl, thenewsbar.url + thenewsbar.suffixFile)
                .replace(props.url, thenewsbar.url)
                .replace(props.object, "")// googleAnalyticsObject ???
            return next()
        }
    } catch (e) {
        return e.message()
    }
    }
});

app.listen(port, function () {
    console.log(`listening on port ${port}`);
    return true
})