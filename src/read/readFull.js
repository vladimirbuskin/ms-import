import fs from 'fs'
import CsvReadableStream from 'csv-reader'


export default function readCss(filename) {
  
  return new Promise((res, rej) => {

    let data = [];
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
          data.push(h);
        }
      })
      .on('end', function () {
        res(data);
      })
      .on('error', function (err) {
        rej(err)
      });


  })
}
  