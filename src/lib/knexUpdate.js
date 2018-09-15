import writeOutput from './writeOutput'
import dataToUpdateSql from './dataToUpdateSql'

let inserted = {};

export default knex => async (data, table, key) => {
  let s1 = new Date();
  let cnt = 0;
  let sql;
  try {
    sql = dataToUpdateSql(table, data, key);
    cnt = await knex.raw(sql);
  } catch(a) {
    writeOutput('errorsUpdate.json', data);
    writeOutput('errorsUpdate.sql', sql);
    console.log('check errorsUpdate.json for data');
    console.log('check errorsUpdate.sql for sql');
    throw a;
  }
  inserted[table] = inserted[table] || 0;
  inserted[table] += data.length;

  let s2 = new Date();
  console.info(`updated keys ${table}: ${inserted[table]} in ${s2 - s1}ms`);

  return cnt
}