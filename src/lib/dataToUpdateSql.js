export default function data(table, data, key) {

  if (data.length === 0) return 0;

  let r = data[0];
  let fields = Object.keys(r).filter(k => k.toLowerCase() !== (key+'').toLowerCase());



  //let values = data.map(r => '(' + fields.map(f => quote(r[f])).join(',') + ')')

  let sql = data.map(r => {
    let fields = Object.keys(r).filter(k => k.toLowerCase() !== (key+'').toLowerCase());

    return `update "${table}" set ${fields.map(f => '"' + f + '"=' + quote(r[f])).join(', ')} where "${key}"=${quote(r[key])}`;
  }).join('\n');

  return sql
}


function quote(v) {
  if (typeof(v) == 'function')
    return v();
  else if (typeof(v) == 'string')
    return "'" + v.replace(/'/g, "''") + "'";
  else if (v === null)
    return 'null'
  else 
    return v;
}