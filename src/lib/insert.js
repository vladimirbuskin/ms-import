

export default async function insert(insertToDb, structure, meta, options) {

  if (insertToDb == null) throw new Error('knex is required 1st param')
  if (structure == null) throw new Error('structure is required 2nd param')
  if (meta == null) throw new Error('meta is required')
  if (Object.keys(structure).length != Object.keys(meta).length) throw new Error('meta should contain the same number of keys as structure')
  options = options || {batch: 100};

  for (var tableName of Object.keys(structure)) {
    var data = structure[tableName]
    var key = meta[tableName]
    
    // var newIds = await knex.insert(table).returning(meta[tableName])
    options = Object.assign({ batch: 100}, options)
    var { batch } = options;

    var prevIds = [];
    var newIds = [];

    // iterate
    for (var i=0; i < data.length/batch; i++) {

      // data chunk
      let chunk = data.slice(i * batch, (i + 1) * batch)

      // prev keys
      let pIds = chunk.map(r => { let keyValue = r[key]; delete r[key]; return keyValue; })
      prevIds.push(pIds);
      // insert
      let nIds = await insertToDb(chunk, tableName, key)//.returning(meta[tableName])

      // set new keys which came from database
      nIds.forEach((id, i) => chunk[i][key] = id)
      newIds.push(nIds);
    }

    // flatten arrays
    prevIds = [].concat(...prevIds);
    newIds = [].concat(...newIds);

    // replace structure
    replaceStructure(structure, prevIds, newIds);        
  }
  return structure;
}


export function replaceStructure(structure, idsPrev, idsNew) {
  Object.keys(structure).forEach(table => {
    replaceTableId(structure[table], idsPrev, idsNew)
  })
}

export function replaceTableId(records, idsPrev, idsNew) {
  if (records.length === 0) return;

  // record object keys
  let keys = Object.keys(records[0]);

  idsPrev.forEach((prev,i) => {
    let nw = idsNew[i];
    records.forEach(r => {    
      keys.forEach(k => {
        if (r[k] === prev) {
          r[k] = nw
        }
      })      
    })
  })
}