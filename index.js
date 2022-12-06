const fetch = require('node-fetch');
require('dotenv').config();
const cors = require("@koa/cors");
const Koa = require("koa");
const app = new Koa();
const port = process.env.PORT;
const PATH_DOMAIN_MAP = require('./config/paths.json');

app.use(cors());

app.use(async function (ctx, next) {
    await new Promise((resolve) => {
        if (ctx.req.method !== 'GET') {
            ctx.req.rawBody = '';

            ctx.req.on('data', (chunk) => {
                ctx.req.rawBody += chunk;
            });

            ctx.req.on("end", () => {
                resolve();
            });
        } else {
            resolve();
        }
    });

    await next();
});

app.use(async (ctx) => {
    const pathParts = ctx.originalUrl.split("/").filter(Boolean);
    const prefix = pathParts.shift();
    const proxyPath = "/" + pathParts.join("/");

    for (let key in PATH_DOMAIN_MAP) {
        // 1. prüfen ob ctx.pathname mit $key beginnt
        if (prefix !== key) {
            // 1.1 wenn nein = continue;
            continue;
        }

        const config = PATH_DOMAIN_MAP[key];

        // 2. wenn ja, fetch(config.fullUrl + ctx.pathname.replace(new Regexp(""))

        try {
            const proxyUrl = config.url + proxyPath;
            console.log(`Proxy ${ctx.method} ${ctx.originalUrl} => ${proxyUrl}`);
            const response = await fetch(proxyUrl, {
                method: ctx.method,
                body: ctx.req.rawBody,
            });

            const headerIterator = response.headers.entries();

            for (let header of headerIterator) {
                // whitelist fuer Header
                if (!["cache-control", "access-control-allow-credentials", "access-control-allow-headers", "access-control-allow-origin", "content-type", "cross-origin-resource-policy", "date", "expires", "last-modified"].includes(header[0])) {
                    continue;
                }
                ctx.set(header[0], header[1]);
            }
            let textBody = await response.text();

            for (let keyInner in PATH_DOMAIN_MAP) {
                // https://www.google-analytics.com => http://localhost:8000/googleAnalytics
                // replace PATH_DOMAIN_MAP.fullUrl, "$REPLACEMENT_DOMAIN/$keyInner"


                const toHost = "//" + ctx.host + "/" + keyInner;
                textBody = textBody
                // .replace("https://www.google-analytics.com/gtm/optimize.js", ctx.host + config.proxyPath)
                // .replace("https://www.google-analytics.com/gtm/js?id=", ctx.host + config.proxyPath)
                // .replace("https://www.google-analytics.com/debug/bootstrap?id=\"+a.get(Na)+", ctx.host + config.proxyPath)

                    .replace(new RegExp(`${escapeRegExp(PATH_DOMAIN_MAP[keyInner].url)}`, "ig"), toHost);
            }

            console.log("SUCCESS");
            ctx.body = textBody;
        } catch (e) {
            console.error(e);
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
    return true;
});

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}