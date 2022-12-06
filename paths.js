const PATH_DOMAIN_MAP = {
     "googletagmanager": {
         url: "https://www.googletagmanager.com",
         proxyPath: "/gtm.js",
         //?id als suffix?   ?id=GTM-P9H4MZM Zeile 31
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
module.exports = PATH_DOMAIN_MAP;