const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

let folderStart = path.join(__dirname, 'files');
let folderCopy = path.join(__dirname, 'files-copy');

fs.access(folderCopy, error => {
  if (!error) {
    fsPromises.readdir(folderCopy, {withFileTypes: true})
      .then(data => {
        for(let i = 0; i < data.length; i++) {
          if(data[i].isFile()) {
            let outputFile = path.join(folderCopy, data[i].name);
            fs.unlink(outputFile, function() {});
          }
        }
        fsPromises.rmdir(folderCopy);
        copyDir();
      });
  } else {
    copyDir();
  }
});

function copyDir() {
  fsPromises.mkdir(folderCopy);
  fsPromises.readdir(folderStart, {withFileTypes: true})
    .then(data => {
      for(let i = 0; i < data.length; i++) {
        if(data[i].isFile()) {
          let inputFile = path.join(folderStart, data[i].name);
          let outputFile = path.join(folderCopy, data[i].name);
          let readableStream = fs.createReadStream(inputFile, 'utf8');
          let writtableStream = fs.createWriteStream(outputFile, 'utf8');
          readableStream.on('data', function(chunk){ 
            writtableStream.write(chunk);
          });
        }
      }
    });
}
