import writeOutput from './writeOutput'
import dataToSql from './dataToInsertSql'

let inserted = {};

export default knex => async (data, table, key) => {
  let s1 = new Date();
  let ids = [];
  try {
    //ids = await knex(table).insert(data).returning(key);
    let sql = dataToSql(table, data, key);
    ids = await knex.raw(sql).map(r => +r[key]);    
  } catch(a) {
    writeOutput('errors.json', data);
    throw a;
  }
  inserted[table] = inserted[table] || 0
  inserted[table] += data.length;

  let s2 = new Date();
  console.info(`inserted ${table}: ${inserted[table]} in ${s2 - s1}ms`);

  return ids
}