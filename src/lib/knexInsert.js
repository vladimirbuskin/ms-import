import writeOutput from './writeOutput'
import dataToSql from './dataToInsertSql'

let inserted = {};

export default knex => async (data, table, key) => {
  let s1 = new Date();
  let ids = [];
  let sql = null;
  try {
    //ids = await knex(table).insert(data).returning(key);
    sql = dataToSql(table, data, key);
    let res = await knex.raw(sql);
    // if res not empty
    // those are keys, map those.
    if (res)
      ids = res.map(r => +r[key]);
  } catch(a) {
    writeOutput('errors.json', data);
    writeOutput('errors.sql', sql);

    console.ERROR('check errors.sql for sql');
    console.ERROR('check errors.json for data');
    throw a;
  }
  inserted[table] = inserted[table] || 0
  inserted[table] += data.length;

  let s2 = new Date();
  console.info(`inserted ${table}: ${inserted[table]} in ${s2 - s1}ms`);

  return ids
}