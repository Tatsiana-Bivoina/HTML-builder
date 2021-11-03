const fs = require('fs');
const path = require('path');

let inputFile = path.join(__dirname, 'text.txt');
let readableStream = fs.createReadStream(inputFile, 'utf8');
readableStream.on('data', function(chunk){ 
  console.log(chunk);
});