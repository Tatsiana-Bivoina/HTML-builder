const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

let folderDist = path.join(__dirname, 'project-dist');
let pathAssetsDist = '';

function readDirectory(folderDist) {
  fs.access(folderDist, error => {
    let folderAssets = path.join(__dirname, 'assets');
    if (!error) {
      copyStyles();
      copyAssets(folderAssets);
      renderHtml();
    } else {
      fsPromises.mkdir(folderDist);
      copyStyles();
      copyAssets(folderAssets);
      renderHtml();
    }
  });
}

readDirectory(folderDist);

function copyStyles() {
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
            let outputFile = path.join(__dirname, 'project-dist', 'style.css');
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
}

function copyAssets(folderAssets) {
  fsPromises.mkdir(path.join(folderDist, 'assets'), {recursive: true});
  fsPromises.readdir(folderAssets)
    .then(data => {
      for(let i = 0; i < data.length; i++) {
        let pathToFolder = path.join(folderAssets, data[i]);
        fs.stat(pathToFolder, (err, stats) => {
          if (err) {
            console.error(err);
            return;
          }
          if(stats.isFile()) {
            if(pathToFolder.includes('svg')) {
              pathAssetsDist = path.join(folderDist, 'assets', 'svg');
            }
            if(pathToFolder.includes('fonts')) {
              pathAssetsDist = path.join(folderDist, 'assets', 'fonts');
            }
            if(pathToFolder.includes('img')) {
              pathAssetsDist = path.join(folderDist, 'assets', 'img');
            }
            let outputFile = path.join(pathAssetsDist, data[i]);
            let readableStream = fs.createReadStream(pathToFolder);
            let writtableStream = fs.createWriteStream(outputFile, {
              encoding: 'utf8'
            });
            readableStream.on('data', function(chunk){ 
              writtableStream.write(chunk);
            });
          } else {
            pathAssetsDist = path.join(folderDist, 'assets', data[i]);
            fsPromises.mkdir(pathAssetsDist, {recursive: true});
            copyAssets(pathToFolder);
          }
        });
      }
    });
}

function renderHtml() {
  let inputFile = path.join(__dirname, 'template.html');
  let readableStream = fs.createReadStream(inputFile, 'utf8');
  let arr = ['{{header}}', '{{articles}}', '{{footer}}', '{{about}}'];
  readableStream.on('data', function(chunk) { 
    arr.forEach((el) => {
      if(chunk.includes(el)) {
        let elem = el.slice(2,-2);
        let readStream = fs.createReadStream(path.join(__dirname, 'components', `${elem}.html`), 'utf8');
        let writeStream = fs.createWriteStream(path.join(folderDist, 'index.html'), 'utf8');
        readStream.on('data', function(part) {
          chunk = chunk.toString().replace(el, part);
          writeStream.write(chunk);
        });
      }
    });
  });
}