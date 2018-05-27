

export default async function insert2(insertToDb, updateToDb, structure, meta, options) {

  if (insertToDb == null) throw new Error('insert Function is required 1st param');
  if (insertToDb == null) throw new Error('udpate Function is required 2nd param');
  if (structure == null) throw new Error('structure is required 3rd param');
  if (meta == null) throw new Error('meta is required 4th param');
  if (Object.keys(structure).length !== Object.keys(meta).length) throw new Error('meta should contain the same number of keys as structure');
  options = options || {batch: 100};

  let tablesFor2ndPath = {};


  //=================================
  // 1ST PASS iterate tables
  for (let tableName of Object.keys(structure)) {
    let data = structure[tableName];
    let key = meta[tableName];

    options = Object.assign({ batch: 100}, options);
    let { batch } = options;

    // iterate
    if (data.length > 0) {
      let keys = Object.keys(data[0]);

      // iterate chunks
      for (let i = 0; i < data.length / batch; i++) {

        // data chunk copies
        let chunk = data.slice(i * batch, (i + 1) * batch);

        // replace in chunk
        let tempKeys = chunk.map(r => {
          let k = r[key];
          // when key is not identity, key will be specified as empty string
          // or any
          if (key == '' || key == null || typeof(k)==='string') return ()=>k;

          // if it is regular key, check that this is refKey
          if (typeof(k) !== 'function') throw new Error(`tableName "${tableName}" key ${key}=${k} is not refKey `);

          return k
        });

        // prepare for insert, remove refKeys (functions) with values;
        chunk = chunk.map(r => {
          // clone
          let c = Object.assign({}, r);

          // delete key
          delete c[key];

          // replace refKeys with values
          keys.forEach(k => {
            if (typeof(c[k]) === 'function' && c[k].key === true) {
              let kv = c[k]();
              if (kv == null) tablesFor2ndPath[tableName] = 1;
              c[k] = kv
            }
          });

          return c;
        });

        // insert
        let realKeys = await insertToDb(chunk, tableName, key);

        // set new values of keys
        tempKeys.forEach((x, i) => x(realKeys[i]));
      }
    }
  }

  //=================================
  // 2ND PASS iterate tables which has keys which now are inserted and has values
  // situation when two tables reference each others
  for (let tableName of Object.keys(tablesFor2ndPath)) {
    let data = structure[tableName];
    let key = meta[tableName];

    options = Object.assign({ batch: 100}, options);
    let { batch } = options;

    // iterate chunks
    if (data.length > 0) {
      let keys = Object.keys(data[0]);
      let updateKeys = [];

      // first pass
      for (let i = 0; i < data.length / batch; i++) {

        // data chunk copies
        let chunk = data.slice(i * batch, (i + 1) * batch);

        // prepare for insert, remove refKeys (functions) with values;
        chunk = chunk.map(r => {
          // clone
          let c = {};

          // replace refKeys with values
          keys.forEach(k => {
            if (typeof(r[k]) === 'function' && r[k].key === true) {
              c[k] = r[k]();
            }
          });

          return c;
        });

        // update
        // tableName - name of table
        // key - key in that table
        // chunk - chunk of records, where only columns which needs to be updated

        // insert
        let res = await updateToDb(chunk, tableName, key);
      }
    }
  }

  // replace keys
  replaceKeys(structure);

  return structure;
}


export function replaceKeys(structure) {
  Object.keys(structure).forEach(table => {
    let data = structure[table];
    if (data.length > 0) {
      let keys = Object.keys(data[0]);
      data.forEach(rec => {
        keys.forEach(key => {
          let val = rec[key];
          // replace keyFunction with keyValue
          if (typeof val === 'function') {
            rec[key] = val();
          }
        })
      })
    }
  })
}

export function replaceKeysTable(data) {
  if (data.length > 0) {
    let keys = Object.keys(data[0]);
    data.forEach(rec => {
      keys.forEach(key => {
        let val = rec[key];
        // replace keyFunction with keyValue
        if (typeof val === 'function') {
          rec[key] = val();
        }
      })
    })
  }
}


export function deleteKeys(data) {
  if (data.length > 0) {
    let keys = Object.keys(data[0]);
    data.forEach(rec => {
      keys.forEach(key => {
        let val = rec[key];
        // replace keyFunction with keyValue
        if (typeof val === 'function') {
          rec[key] = val();
        }
      })
    })
  }
}