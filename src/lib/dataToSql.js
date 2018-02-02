export default function data(table, data, key) {

  if (data.length === 0) return 0;

  let r = data[0];
  let fields = Object.keys(r);

  let values = data.map(r => '(' + fields.map(f => quote(r[f])).join(',') + ')')

  let sql = `insert into [${table}] (${fields.map(f=>'['+f+']')}) output inserted.[${key}] values ${values.join(',')}`;
  return sql
}


function quote(v) {
  if (typeof(v) == 'string')
    return "'" + v.replace(/'/g, "''") + "'";
  else 
    return v;
}