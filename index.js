//import fetch from 'node-fetch';
require('dotenv').config();
const cors = require("@koa/cors");
const Koa = require("koa");
const app = new Koa();
const port = process.env.PORT;
const PATH_DOMAIN_MAP = require('./paths');

app.use(cors())

app.use(async (ctx, next) => {
    const pathParts = ctx.originalUrl.split("/").filter(Boolean);
    const prefix = pathParts.shift();
    const proxyPath = "/" + pathParts.join("/");

    for(let key in PATH_DOMAIN_MAP) {

        // 1. prüfen ob ctx.pathname mit $key beginnt
        if(prefix !== key) {
            // 1.1 wenn nein = continue;
            continue;
        }

        const config = PATH_DOMAIN_MAP[key];




        // 2. wenn ja, fetch(config.fullUrl + ctx.pathname.replace(new Regexp(""))

        try {
            function suffix() {

                if(config.url === "https://www.googletagmanager.com") {
                    let suffixCheck = config.proxyPath.replace("/", "")
                    console.log(config.url)
                    return pathParts[0].replace(suffixCheck, "")
                } else {
                    return ""
                }
            }
            const response = await fetch(config.url + config.proxyPath + suffix());

            const headerIterator = response.headers.entries()

            for (let header of headerIterator) {
                if(!["cache-control", "access-control-allow-credentials", "access-control-allow-headers", "access-control-allow-origin", "content-type", "cross-origin-resource-policy", "date", "expires", "last-modified"].includes(header[0])) {
                    continue;
                }
                ctx.set(header[0], header[1])
            }
            const textBody =  await response.text();

            // todo values replacen

            // PATH_DOMAIN_MAPPEN und abhaengig von ergebniss replaces, ctx.body schicken

            for(let keyInner in PATH_DOMAIN_MAP) {
                // https://www.google-analytics.com => http://localhost:8000/googleAnalytics
                // replace PATH_DOMAIN_MAP.fullUrl, "$REPLACEMENT_DOMAIN/$keyInner"

                ctx.body = textBody
                    // .replace("google-analytics", ctx.host)
                    // .replace("www.google-analytics.com", ctx.host)
                    // .replace("https://www.google-analytics.com/gtm/optimize.js", ctx.host + config.proxyPath)
                    // .replace("https://www.google-analytics.com/gtm/js?id=", ctx.host + config.proxyPath)
                    // .replace("https://www.google-analytics.com/debug/bootstrap?id=\"+a.get(Na)+", ctx.host + config.proxyPath)

                    .replace(PATH_DOMAIN_MAP[keyInner].url, ctx.host + config.proxyPath)
                    .replace(PATH_DOMAIN_MAP[keyInner].url + PATH_DOMAIN_MAP[keyInner].proxyPath, ctx.host + PATH_DOMAIN_MAP[keyInner].proxyPath);
            }


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