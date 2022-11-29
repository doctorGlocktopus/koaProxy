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
        suffixFile:'/static/pw.js',
        suffix:'/thenewsbar'
    },
    "googleAdd": {
        url: "www.googletagmanager.com",
        fullUrl: "https://www.googletagmanager.com",
        suffixFile: "/gtm.js?id=GTM-P9H4MZM",
        strangeString: '"https://www.googletagmanager.com/a?id="+Qg.M+"&cv=266",Yh={label:Qg.M+"',
    },
    'googleAnalytics': {
        url: "www.google-analytics.com",
        fullUrl: "https://www.google-analytics.com",
        suffix: "/gtm/js?id=",
        suffixFile: "/analytics.js",
        strangeString: '"https://www.google-analytics.com/debug/bootstrap?id="+a.get(Na)+"&src=LEGACY&cond="+b'
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
        case PATH_DOMAIN_MAP.ams.suffix + PATH_DOMAIN_MAP.ams.suffixFile:
            await blend(PATH_DOMAIN_MAP.ams)
            break;
        case PATH_DOMAIN_MAP.googleAdd.suffixFile:
            console.log(1)
            await blend(PATH_DOMAIN_MAP.googleAdd)
            break;
        case PATH_DOMAIN_MAP.googleAnalytics.suffixFile:
            await blend(PATH_DOMAIN_MAP.googleAnalytics)
            break;
        default:
            break;
    }

async function blend(props) {



        let thenewsbar = PATH_DOMAIN_MAP.thenewsbar

        try {
            // AMS Auto-Motor-Sport
            if(props.fullUrl === PATH_DOMAIN_MAP.ams.fullUrl) {
                let plane = await fetch(props.fullUrl + props.suffix + props.suffixFile)
                let text = await plane.text()
                ctx.body = text
                    .replace(props.fullUrl + props.suffix, thenewsbar.url)
                    .replace(props.fullUrl, thenewsbar.url)
                return next()
            }

            // www.googletagmanager.com
            if(props.fullUrl === PATH_DOMAIN_MAP.googleAdd.fullUrl) {
                let plane = await fetch(props.fullUrl + props.suffixFile)
                // // header von der request benutzen
                // //console.log(plane.headers)
                // // die Header aus plane.headers extrahieren und dann übertragen
                let text = await plane.text()
                ctx.body = text
                    .replace(props.url, thenewsbar.url)
                    .replace(props.strangeString, thenewsbar.url + thenewsbar.suffixFile)
                return next()
            }

            // www.google-analytics.com
            if(props.fullUrl === PATH_DOMAIN_MAP.googleAnalytics.fullUrl) {
                console.log(props.fullUrl + props.suffixFile)
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