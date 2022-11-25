import fs from "fs"
// import { Transform } from 'stream';

// fs.readFile('./access.log', 'utf8', (err, data) => console.log(data))

// const data = fs.readFileSync('./access.log', 'utf8');
//console.log(data)

// const log1 = '127.0.0.1 - - [30/Jan/2021:11:11:20 -0300] "POST /foo HTTP/1.1" 200 0 "-" "curl/7.47.0"';
// fs.writeFile('./access.log', '\r' + log1, {flag: 'a'} ,err => console.log(err))

// const log2 = '127.0.0.1 - - [30/Jan/2021:11:11:25 -0300] "GET /boo HTTP/1.1" 404 0 "-" "curl/7.47.0"';
// fs.writeFileSync('./access.log', '\r' + log2, {flag: 'a'})

// fs.appendFile('./access.log', 'data', err => console.log(err))
// fs.appendFileSync('./access.log', 'data')

// const readStream = fs.createReadStream('./access.log', 'utf8');
// readStream.on('data', chunk => {
//     console.log('Chunk');
//     console.log(chunk)
// })
// readStream.on('end', () => console.log('The end!'));
// readStream.on('error', () => console.log('err'));

// const writeStream = fs.createWriteStream('./access.log', {flags: 'a', encoding: 'utf8'});
// writeStream.write('\r' + log1);
// writeStream.end(() => console.log('The end!'))


// const readStream = fs.createReadStream('./access.log', 'utf8');
//
// const transformStream = new Transform({
//     transform(chunk, encoding, callback) {
//         const transformedChunk = chunk.toString().replace(/127.0.0.1/g, '');
//
//         this.push(transformedChunk);
//
//         callback()
//     }
// })
//
// readStream.pipe(transformStream).pipe(process.stdout)

const readStream = fs.createReadStream('./access_tmp.log', 'utf8');
const writeStream89 = fs.createWriteStream('./89.123.1.41_requests.log', {flags: 'a', encoding: 'utf8'});
const writeStream34 =  fs.createWriteStream('./34.48.240.111_requests.log', {flags: 'a', encoding: 'utf8'});

readStream.on('data', chunk =>  {
    writeStream89.write(chunk.split`\r`.filter(item => item.includes('89.123.1.41')).join``);
    writeStream89.end(() => console.log('Writing items with ip 89.123.1.41 finished'));

    writeStream34.write(chunk.split`\r`.filter(item => item.includes('34.48.240.111')).join``);
    writeStream34.end(() => console.log('Writing items with ip 34.48.240.111 finished'));
})