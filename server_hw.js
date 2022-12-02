import http from 'http';
import path from "path";
import fsp from 'fs/promises';
import url from "url";
import formidable from 'formidable';
import cluster from "cluster";
import os from 'os';
import * as Process from "process";
import fs from "fs";
import cp from 'child_process';

// const host = 'localhost';
// const port = 3000;
//
// // const users = [
// //     {name: 'igor', age: 12},
// //     {name: 'mat', age: 13},
// //     {name: 'egor', age: 15}
// // ]
// //
// // const routes = {
// //     '/': '<h1>Hello world!</h1>',
// //     '/users': users,
// //     '/users/:id': params => {}
// // }
// //
// // const findRoutes = url => {
// //     if (routes[url]) return routes[url];
// // }
//
// const server = http.createServer((req, res) => {
//     // if (req.method === 'GET') {
//     //     // const queryParams = url.parse(req.url, true).query
//     //     // result = JSON.stringify(queryParams);
//     //     res.setHeader('Content-Type', 'application/json');
//     //     const route = findRoutes(req.url.split`?`[0]);
//     //     res.end(JSON.stringify(route))
//     // } else if (req.method === 'POST') {
//     //     res.writeHead(200, {"Content-Type": "json"})
//     //     let data = '';
//     //     req.on('data', chunk => {
//     //         data += chunk
//     //         res.end(data)
//     //     });
//     //
//     //     req.on('end', () => {
//     //
//     //     });
//     //
//     // } else {
//     //     res.statusCode = 405;
//     //     res.end('Method not allowed');
//     // }
//
//     // const filePath = path.join(process.cwd(), '/access.log');
//     // const readStream = fs.createReadStream(filePath, {encoding: 'utf-8'});
//     //
//     // readStream.on('data', chunk => {
//     //     console.log(chunk);
//     //     res.write(chunk);
//     // })
//     //
//     // readStream.on('data', () => {
//     //     res.end();
//     // })
//     //
//     // // readStream.pipe(res)
//     if (req.method === 'POST') {
//         const mfd = req.headers['content-type'].split`;`[0];
//         if (mfd === 'multipart/form-data') {
//             const form = formidable({ multiples: true });
//             form.parse(req, async (err, fields, files) => {
//                 for (const fileName in files) {
//                     const blob = files[fileName]
//                     const oldPath = blob.filepath;
//                     const destPath = '.';
//                     const rawData = await fsp.readFile(oldPath);
//
//                     console.log(blob);
//                     await fsp.writeFile(path.join(process.cwd(), destPath, 'access.log'), rawData);
//                 }
//             })
//         }
//     }
// });
//
// server.listen(port, host, () => console.log(`Server running at http://${host}:${port}`))

// const numCPUs = os.cpus().length;
//
// if (cluster.isPrimary) {
//     console.log(`Master ${process.pid} is running...`);
//
//     for (let i = 0; i < numCPUs; i++) {
//         console.log(`Forking process ${i}...`);
//         cluster.fork();
//     }
// } else {
//     const host = 'localhost';
//     const port = 3000;
//
//     const server = http.createServer((req, res) => {
//         console.log(`Worker ${process.pid} handle this request...`);
//
//         setTimeout(() => {
//             res.end('Hello world!');
//         }, 5000)
//     })
//
//     server.listen(port, host, () => console.log(`Server running at http://${host}:${port}`))
// }

// const numCPUs = os.cpus().length;
// console.log(`Master ${process.pid} is running...`);
//
// let i = 0
// while(i < numCPUs) {
//     cp.fork('worker.js', [i])
//     i++
// }

import http from 'http';
import fsp from 'fs/promises';
import path from 'path';
const port = process.env.PORT || 3000
const host = 'localhost'

const getTemplate = (data) => {
    return `
    <tr>
      <td>${data.type ?? ''}</td>
      <td><a href="${data.href}">${data.name}</a></td>
      <td>${data.time ?? ''}</td>
      <td>${data.size ?? ''}</td>
      <td></td>
    </tr>
  `
}

const getDirectoryListTemplate = async (directoryPath, requestUrl) => {
    const list = await fsp.readdir(directoryPath)
    const data = await Promise.all(
        list.map(async (item) => {
            const stat = await fsp.stat(path.join(directoryPath, item))
            const href = `${requestUrl}${requestUrl === '/' ? '' : '/'}${item}`
            const type = stat.isDirectory() ? '📁' : '📄'
            const time = new Date(stat.atime).toLocaleString()

            return getTemplate({
                type,
                href,
                name: item,
                time,
                size: stat.size
            })
        })
    )

    if (requestUrl !== '/') {
        const href = requestUrl.split('/').slice(0, -1).join('/')
        const parentDirectory = getTemplate({
            type: '🔙',
            href: href === '' ? '/' : href,
            name: 'Parent directory'
        })

        data.unshift(parentDirectory)
    }

    return data.join('')
}

const requestListener = async (request, response) => {
    try {
        const fullPath = path.join(__dirname, request.url)
        const stat = await fsp.stat(fullPath)
        const filePath = stat.isDirectory() ? path.join(__dirname, 'index.html') : fullPath
        let data = await fsp.readFile(filePath)

        if (stat.isDirectory()) {
            const list = await getDirectoryListTemplate(fullPath, request.url)

            data = data.toString()
                .replaceAll('{path}', request.url)
                .replace('{list}', list)
        }

        response.writeHead(200)
        response.end(data)
    } catch (error) {
        if (error.code === 'ENOENT') {
            response.writeHead(404)
        }

        console.log(error)
    } finally {
        response.end()
    }
}

const server = http.createServer(requestListener)

server.listen(port, host, () => {
    console.log(`Server listens http://${host}:${port}`)
})

server.on('error', (error) => {
    console.log(error)
})