const http = require("http");
const fs = require("fs");
const stream = require("stream");

const possibleRoute = [
    { route: "/", page: "./static/index.html" },
    { route: "/about", page: "./static/about.html" },
    { route: "/contact", page: "./static/contact-me.html" }
];

/**
 * @param {string} page
 * @param {http.ServerResponse} res 
 */
function loadPage(page, res) {
    stream.pipeline(fs.createReadStream(page), res, err => {
        if (err)
            console.log(err);
    });
}


/**
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
function getRequestHandle(req, res) {
    const route = req.url;
    const pathFound = possibleRoute.find((val) => val.route === route);

    if (pathFound) loadPage(pathFound.page, res);
    else loadPage("./static/404.html", res);
}


const server = http.createServer((req, res) => {
    if (req.method === "GET") getRequestHandle(req, res);

    else if (req.method === "POST") {
        if (req.url !== "/contact") return;
        req.on("data", chunk => {
            const url = Buffer.from(chunk).toString()
            console.log(url);

            res.writeHead(302, { "Location": "/" });
            res.end();
        });
    }
});

const port = process.env["PORT"] || 5000;
server.listen(port, () =>
    console.log(`Server is now running on port ${port}...`));
