//import fetch from 'node-fetch';
require('dotenv').config();
const cors = require("@koa/cors");
const Koa = require("koa");
const app = new Koa();
const port = process.env.PORT;

//app.use(cors())

// erster Schritt

// http://localhost:8000/googleAdd/analytics.js
// http://localhost:8000/ams/static/pw.js

const REPLACEMENT_DOMAIN = "http://localhost:8000";


// PATH_DOMAIN_MAP
const PATH_DOMAIN_MAP = {
    "googletagmanager": {
        url: "https://www.googletagmanager.com",
        proxyPath: "/gtm.js?id=GTM-P9H4MZM",
    },
    'google-analytics': {
        url: "https://www.google-analytics.com",
        proxyPath: "/analytics.js",
    },
    'thenewsbar': {
        url: "https://pw.thenewsbar.net",
        proxyPath: '/static/pw.js',
    },
};


app.use(async (ctx, next) => {


    // ctx.pathname = /thennewsbar/static/pw.js?v=123
    const pathParts = ctx.originalUrl.split("/").filter(Boolean);

    // pathParts = ["thenewsbar", "static", "pw.js?v=123"]
    const prefix = pathParts.shift();
    // pathParts = ["static", "pw.js?v=123"]
    // prefix = "thenewsbar"

    const proxyPath = "/" + pathParts.join("/");
    // prefix = "thenewsbar"
    // proxyPath = "/static/pw.js?v=123"

    for(let key in PATH_DOMAIN_MAP) {

        // 1. prüfen ob ctx.pathname mit $key beginnt
        if(prefix !== key) {
            // console.log(prefix !== key, prefix, key)
            // 1.1 wenn nein = continue;
            continue;
        }

        const config = PATH_DOMAIN_MAP[key];

        // 2. wenn ja, fetch(config.fullUrl + ctx.pathname.replace(new Regexp(""))
        try {

            const message = "fetch url" + config.url + config.proxyPath
            // console.time(message)  //console.time misst die Laenge von time -> timeEnd


            const response = await fetch(config.url + config.proxyPath);


            // ctx.set('Access-Control-Allow-Origin', '*');

            const headerIterator = response.headers.entries()

            for (let header of headerIterator) {
                if(!["cache-control", "access-control-allow-credentials", "access-control-allow-headers", "access-control-allow-origin", "content-type", "cross-origin-resource-policy", "date", "expires", "last-modified"].includes(header[0])) {
                    continue;
                }
                // console.log(header[0], header[1])
                ctx.set(header[0], header[1])
            }
            const textBody =  await response.text();
            // console.timeEnd(message)
            // console.log(textBody.length)
            // todo values replacen


            // PATH_DOMAIN_MAPPEN und abhaengig von ergebniss replaces, ctx.body schicken

            for(let keyInner in PATH_DOMAIN_MAP) {
                // https://www.google-analytics.com => http://localhost:8000/googleAnalytics
                // replace PATH_DOMAIN_MAP.fullUrl, "$REPLACEMENT_DOMAIN/$keyInner"
            }

            ctx.body = textBody;
        } catch(e) {
            console.error(e)
        }

    }

    // AMS Auto-Motor-Sport
    // if(ctx.originalUrl === PATH_DOMAIN_MAP.ams.suffixFile) {
    //     let props = PATH_DOMAIN_MAP.ams
    //     let plane = await fetch(props.fullUrl + props.suffixFile)
    //     let text = await plane.text()
    //
    //     // console.log(1, ctx.headers)
    //     // console.log(2, plane.headers)
    //     // plane.headers = ctx.headers;
    //     // console.log(3, plane.headers)
    //
    //     //console.log(plane.headers)
    //
    //     console.log()
    //     ctx.body = text
    //         .replace(props.fullUrl + props.suffix, thenewsbar.url)
    //         .replace(props.fullUrl, thenewsbar.url)
    //
    //     return next()
    // }

    // // www.googletagmanager.com
    // if(ctx.originalUrl === PATH_DOMAIN_MAP.googleAdd.suffixFile) {
    //     let props = PATH_DOMAIN_MAP.googleAdd
    //     let plane = await fetch(props.fullUrl + props.suffixFile)
    //     let text = await plane.text()
    //     ctx.body = text
    //         .replace(props.url, thenewsbar.url)
    //         .replace(props.fullUrl, thenewsbar.url + thenewsbar.suffixFile)
    //     return next()
    // }
    //
    // //www.google-analytics.com
    // if(ctx.originalUrl === PATH_DOMAIN_MAP.googleAnalytics.suffixFile) {
    //     let props = PATH_DOMAIN_MAP.googleAnalytics
    //     let plane = await fetch(props.fullUrl + props.suffixFile)
    //     let text = await plane.text()
    //     ctx.body = text
    //         .replace(props.fullUrl + props.suffix, thenewsbar.url)
    //         .replace(props.suffixFile, thenewsbar.url)
    //         .replace(props.urlNoHost, thenewsbar.name)   //createPolicy("google-analytics"
    //         .replace("//" + props.url, thenewsbar.url)
    //         .replace(props.fullUrl, thenewsbar.url + thenewsbar.suffixFile)
    //         .replace(props.url, thenewsbar.url)
    //         .replace(props.object, "")// googleAnalyticsObject ???
    //     return next()
    // }
});

app.listen(port, function () {
    console.log(`listening on port ${port}`);
    return true
})

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}