const fs = require('fs/promises');
const path = require('path');

let secretFolder = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolder, {withFileTypes: true})
  .then(data => {
    for(let i = 0; i < data.length; i++) {
      if(data[i].isFile()) {
        let fileName = data[i].name.split('.')[0];
        let fileExt = path.extname(data[i].name).slice(1);
        let fileSizeInBytes  = 0;
        fs.stat(path.join(__dirname, 'secret-folder', `${data[i].name}`))
          .then(Stats => {
            fileSizeInBytes = Stats.size;
            let fileSizeInKbytes  = fileSizeInBytes / 1024;
            console.log(`${fileName} - ${fileExt} - ${fileSizeInKbytes}kb`);
          });
      }
    }
  });
