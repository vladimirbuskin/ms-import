import fs from 'fs'

export default function(filename, data) {

  return new Promise((res, rej) => {

    // delete file
    fs.unlink(filename, function(err) {
      if (err) 
      {
        // file was not exists, it is ok
      }

      // return if file not exists
      if (data == null) res();
      
      // open file
      fs.open(filename, 'a', function(err, fd) {

        if (err) return rej(err);

        // stringify
        if (typeof(data) === 'object') {
          data = JSON.stringify(data, 2, 2);
        }

        // write to file
        console.log('FILE', fd);
        fs.write(fd, data, function(err) {

          if (err) return rej(err);

          // success
          res();
        })

      })

    });
  
  })

}