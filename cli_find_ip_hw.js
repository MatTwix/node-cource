#!/usr/local/bin/node
// import readline from 'readline'
// import yargs from 'yargs'
// import { hideBin } from 'yargs/helpers'
import fs from "fs";
import path from "path"
import inquirer from 'inquirer'
import fsp from "fs/promises";

// const options = yargs(hideBin(process.argv))
//     .usage('Usage: -p <path>')
//     .option('p', { alias: 'path', describe: 'Path to file', demandOption: true })
//     .argv;
//
// const dirPath = options.path
//
// console.log(dirPath);
//
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// })
//
// rl.question('Please enter the path to the file: ', (fileName) => {
//     fs.readFile(path.join(__dirname, fileName), 'utf-8', (err, data) => {
//         console.log(data)
//         rl.close()
//     })
// })
//
// rl.on('close', () => process.exit(0))

fsp
    .readdir(path.join())
    .then(async inDir => {
            const list = [];
            for (const item of inDir) {
                const src = await fsp.stat(item)
                if (src.isFile()) list.push(item)
            }
            return list;
        }
    )
    .then(choices => {
        return inquirer.prompt({
            name: 'fileName',
            type: 'list',
            message: 'Choose file',
            choices
        })
    })
    .then(({fileName}) => fsp.readFile(fileName, 'utf-8'))
    .then(data => {
        if(data.includes`\r`) {
            const writeStream89 = fs.createWriteStream('./89.123.1.41_requests.log', {flags: 'a', encoding: 'utf8'});
            const writeStream34 = fs.createWriteStream('./34.48.240.111_requests.log', {flags: 'a', encoding: 'utf8'});

            writeStream89.write(data.split`\r`.filter(item => item.includes('89.123.1.41')).join``);
            writeStream89.end(() => console.log('Writing items with ip 89.123.1.41 finished'));

            writeStream34.write(data.split`\r`.filter(item => item.includes('34.48.240.111')).join``);
            writeStream34.end(() => console.log('Writing items with ip 34.48.240.111 finished'));
        } else {
            console.log('File does not contain ip\'s ')
        }
    })

