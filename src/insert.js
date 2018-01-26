

export default async function insert(insertToDb, structure, meta) {

  if (insertToDb == null) throw new Error('knex is required 1st param')
  if (structure == null) throw new Error('structure is required 2nd param')
  if (meta == null) throw new Error('meta is required')
  if (Object.keys(structure).length != Object.keys(meta).length) throw new Error('meta should contain the same number of keys as structure')

  Object.keys(structure).forEach(async tableName => {
    var table = structure[tableName]
    var key = meta[tableName]
    // return keys, and remove those
    var prevIds = table.map(r => { let keyValue = r[key]; delete r[key]; return keyValue; })
    
    //var newIds = await knex.insert(table).returning(meta[tableName])
    var newIds = await insertToDb(table, tableName, key)//.returning(meta[tableName])

    // set new keys which came from database
    newIds.forEach((id, i) => table[i][key] = id)

    replaceStructure(structure, prevIds, newIds);
  })
  return structure;
}


export function replaceStructure(structure, idsPrev, idsNew) {
  Object.keys(structure).forEach(table => {
    replaceTableId(structure[table], idsPrev, idsNew)
  })
}

export function replaceTableId(records, idsPrev, idsNew) {

  idsPrev.forEach((keyValue,i) => {
    records.forEach((r,i) => {    
      Object.keys(r).forEach(k => {
        
        if (r[k] === keyValue) {
          r[k] = idsNew[i]
        }
        
      })      
    })
  })
}
