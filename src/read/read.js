import fs from 'fs'
import CsvReadableStream from 'csv-reader'


export default function read(filename, cb) {
  
    var header = null;

    var inputStream = fs.createReadStream(filename, 'utf8');
    inputStream
      .pipe(CsvReadableStream({
        parseNumbers: true,
        parseBooleans: true,
        trim: true
      }))
      .on('data', function (row) {
        if (header == null) 
        {
          header = row;
        }
        else 
        {
          let h = row.reduce((h, v, i) => { h[header[i]] = v; return h }, {})
          cb(null, h);
        }
      })
      .on('end', function (data) {
        cb();
      })
      .on('error', function (err) {
        cb(err)
      });
  }
  