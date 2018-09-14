export default function data(table, data, key) {

  if (!Array.isArray(data)) throw new Error('data is not array, it is "' + typeof(data) + '"');
  if (data.length === 0) return 0;

  let r = data[0];
  let fields = Object.keys(r);
  
  let values = data.map(r => '(' + fields.map(f => quote(r[f])).join(',') + ')')
  
  let keyIsEmpty = (key === '' || key == null);

  let sql = `insert into [${table}] (${fields.map(f=>'['+f+']')}) ${ keyIsEmpty ? '':`output inserted.[${key}] `}values ${values.join(',')}`;
  return sql
}


function quote(v) {
  if (typeof(v) == 'function')
    return v();
  else if (typeof(v) == 'string')
    return "'" + v.replace(/'/g, "''") + "'";
  else if (v == null)
    return 'null'
  else 
    return v;
}