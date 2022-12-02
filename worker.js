import http from 'http';
import fs from "fs";
import path from 'path'

const host = 'localhost';
const startedPort = 3000;
const shift = parseInt(process.argv[2]);
const port = startedPort + shift

const server = http
    .createServer((req, res) => {
        console.log(`Worker ${process.pid} handle this request...`);

        const filePath = path.join(process.cwd(), '/access.log');
        const readStream = fs.createReadStream(filePath, {encoding: 'utf-8'});

        readStream.on('data', chunk => {
            console.log(chunk);
            res.write(chunk);
        })

        readStream.on('data', () => {
            res.end();
        })
    })

    server.listen(port, host, () => console.log(`Server running at http://${host}:${port}`))