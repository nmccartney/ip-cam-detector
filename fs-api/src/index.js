app = require('express')();
var cors = require('cors')
restfs = require('./fileserver') // require('rest-fs');

const PORT = 3000

app.use(cors())
app.use(beforeRestFs)
app = restfs(app);
app.use(afterRestFs)

app.listen(PORT, function (err) {
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
})

const fs = require("fs");
function afterRestFs(req, res, next) {
    console.log(`Got AFTER req: ${req.url} METH: ${req.method}`)
    // return res.status(200).download(req.url)
    // next()

    fs.readFile(req.url, (err, data) => {
        if (err) {
            reject(err);
        }
        console.log('img: ', Object.keys(data));
        res.send(data);
        // res.status(200).send(Buffer.from(data, 'binary'))
    });
}

function beforeRestFs(req, res, next) {
    console.log(`Got B4 req: ${req.url} METH: ${req.method}`)
    // short circut favicon
    if (req.url === '/favicon.ico') {
        res.type('image/x-icon');
        res.status(301);
        res.end();
        return;
    }
    if (req.method === 'GET') {
        // Do some code
        console.log(req.url)
        req.url = '/usr/src/node-app/ftp-dir' + req.url
    }
    //
    if (req.method === 'POST') {
        res.status(304);
        res.end();
    }
    if (req.method === 'PUT') {
        res.status(304);
        res.end();
    }

    // if (req.method === 'DELETE') {
    //     res.status(304);
    //     res.end();
    // }

    // keep executing the router middleware
    next()
}

