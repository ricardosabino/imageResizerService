import axios from "axios";
import sharp from 'sharp';
import * as http from 'http';
const url = require('url');

const hostname = '127.0.0.1';
const port = 3000;
const defaultWidth = 200;

const server = http.createServer((req, res) => {
    const qs = url.parse(req.url, true).query;
    if (!qs.url) {
        res.statusCode = 200;
        res.end();
        return;
    }

    const width = parseInt(qs.width);
    resize(qs.url, isNaN(width) ? defaultWidth : width, res);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

const resize = async (url: string, width: number, res: http.ServerResponse) => {
    const input = (await axios({ url, responseType: "arraybuffer" })).data as Buffer;
    const data = await sharp(input).resize({ width }).png().toBuffer();
    res.setHeader('Content-Type', 'image/png');
    res.statusCode = 200;
    res.end(data);
};