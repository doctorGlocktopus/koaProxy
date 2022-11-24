const Application = require("../../../lib/Application");
const fetch = require("cross-fetch");
const {escapeForRegexp} = require("@vaModules/util/string");

const STATIC_SCRIPTS = {
    "/static/pw.js": "https://pw.thenewsbar.net/static/pw.js",
    "/async/upScore.js": "https://files.upscore.com/async/upScore.js",
    "/metrics/i": "https://metrics.thenewsbar.net/metrics/i",
};

const PATH_DOMAIN_MAP = {
    "upscore": "//files.upscore.com",
    "thenewsbar": "//pw.thenewsbar.net",
    "metricsthenewsbar": "//metrics.thenewsbar.net",
};

const upScoreProxy = async (req, res, next) => {
    const pathParts = req.baseUrl.split("/").filter(Boolean);
    const firstPathPart = pathParts.shift();

    if (!PATH_DOMAIN_MAP[firstPathPart]) {
        return next();
    }

    const remotePathPart = pathParts.join("/");
    const remoteUrl = `https:${PATH_DOMAIN_MAP[firstPathPart]}/${remotePathPart}`;

    Application.modules.irfrontend.log.info(`Proxy request ${req.originalUrl} to ${remoteUrl}`);
    try {
        if (await proxyReq(req, res, remoteUrl)) {
            return;
        }
    } catch (e) {
        Application.modules.irfrontend.log.error(`Error in proxy to ${remoteUrl}`);
        Application.modules.irfrontend.log.error(e.message);
    }

    return next();
};

const replaceDomains = (content) => {
    for (let path in PATH_DOMAIN_MAP) {
        const domain = PATH_DOMAIN_MAP[path];
        const fromRegexp = new RegExp(`${escapeForRegexp(domain)}`, "g");
        const fromRegexpHttps = new RegExp(`${escapeForRegexp(`https:${domain}`)}`, "g");
        const toDomain = `${process.env.UPSCORE_REPLACE || Application.appConfigs.misc.url}/${path}`;

        content = content.replace(fromRegexpHttps, toDomain);
        content = content.replace(fromRegexp, toDomain);
    }

    return content;
};

const getRawBodyFromRequest = async (req) => {
    return new Promise((resolve, reject) => {
        let rawBody = "";
        req.setEncoding('utf8');
        req.on('data', function (chunk) {
            rawBody += chunk;
        });
        req.on('end', () => resolve(rawBody));
    });
};

const proxyReq = async (req, res, to) => {
    let remoteRes;

    if (req.method === "POST") {
        const rawBody = await getRawBodyFromRequest(req);

        remoteRes = await fetch(to, {
            method: "POST",
            headers: {"user-agent": "vonAffenfels Proxy"},
            body: rawBody,
        });
    } else {
        remoteRes = await fetch(to, {
            method: "GET",
            headers: {"user-agent": "vonAffenfels Proxy"},
        });
    }
    const passTroughHeaders = ["cache-control", "content-type"];

    if (remoteRes.ok) {
        const headers = remoteRes.headers;
        const content = await remoteRes.text();

        for (let i = 0; i < passTroughHeaders.length; i++) {
            const passTroughHeader = passTroughHeaders[i];
            if (headers.get(passTroughHeader)) {
                res.setHeader(passTroughHeader, headers.get(passTroughHeader));
            }
        }

        res.end(replaceDomains(content));
        return true;
    } else {
        Application.modules.irfrontend.log.error(`Proxy to ${to} unsuccessful Code: ${remoteRes.status}`);

        for (let i = 0; i < STATIC_SCRIPTS.length; i++) {
            const staticscript = STATIC_SCRIPTS[i];

            if (req.baseUrl.endsWith(staticscript)) {
                res.status(remoteRes.status);
                res.end();
                return true; // send the 404 so we fail FAST
            }
        }
    }

    return false;
};

module.exports = {upScoreProxy};