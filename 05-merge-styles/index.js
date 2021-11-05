const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

let folderStyles = path.join(__dirname, 'styles');
let dataStyles = [];

fsPromises.readdir(folderStyles)
  .then(data => {
    for(let i = 0; i < data.length; i++) {
      let pathStyles = path.join(folderStyles, data[i]);
      fs.stat(pathStyles, (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }
        if(stats.isFile() && path.extname(data[i]) == '.css') {
          let outputFile = path.join(__dirname, 'project-dist', 'bundle.css');
          let readableStream = fs.createReadStream(pathStyles);
          let writtableStream = fs.createWriteStream(outputFile, {
            encoding: 'utf8'
          });
          readableStream.on('data', function(chunk){ 
            dataStyles.push(chunk);
          });
          readableStream.on('end', function(){ 
            for(let j = 0; j < dataStyles.length; j++) {
              writtableStream.write(dataStyles[j].toString() + '\n');
            }
          });
        }
      });
    }
  });