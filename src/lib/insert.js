

export default async function insert2(insertToDb, structure, meta, options) {

  if (insertToDb == null) throw new Error('knex is required 1st param');
  if (structure == null) throw new Error('structure is required 2nd param');
  if (meta == null) throw new Error('meta is required');
  if (Object.keys(structure).length !== Object.keys(meta).length) throw new Error('meta should contain the same number of keys as structure')
  options = options || {batch: 100};

  // iterate tables
  for (let tableName of Object.keys(structure)) {
    let data = structure[tableName];
    let key = meta[tableName];

    options = Object.assign({ batch: 100}, options);
    let { batch } = options;

    // iterate
    if (data.length > 0) {
      let keys = Object.keys(data[0]);
      for (let i = 0; i < data.length / batch; i++) {

        // data chunk copies
        let chunk = data.slice(i * batch, (i + 1) * batch);

        // replace in chunk
        let tempKeys = chunk.map(r => {
          let k = r[key];
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
            if (typeof(c[k]) === 'function' && c[k].key === true)
              c[k] = c[k]()
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