const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

let outputFile = path.join(__dirname, 'output.txt');
let writtableStream = fs.createWriteStream(outputFile, {
  flags: 'a',
  encoding: 'utf8'
});

const rl = readline.createInterface({ input, output });

writtableStream.write('');
console.log('Введите текст: ');
rl.on('line', (line) => {
  if(line.includes('exit')) {
    console.log('Спасибо! До свидания!');
    rl.close();
  } else {
    console.log('Введите текст: ');
    writtableStream.write(`${line}\n`);
  }
});

rl.on('SIGINT', () => {
  console.log('Спасибо! До свидания!');
  rl.close();
});
