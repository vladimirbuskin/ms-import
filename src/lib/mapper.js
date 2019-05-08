export default function mapper(def, rec, map) {
  var r = def;

  // // validate that all fields are processed
  // Object.keys(rec).forEach(k => {
  //  var v = rec[k]
  //  if (k === '' && v) {
  //    console.warn('csv key is empty, but value exists');
  //  }
  //  if (k !== '') {     
  //    var cfg = map.find(m => m.value == k)
  //    if (cfg) {
  //    }
  //    else
  //    {
  //      console.warn('Map is not found for "' + k + '" field.');
  //    }
  //  }
  // })

  // map fields
  map.forEach(m => {
    
    var {
      name,
      value
    } = m
    
    if (value == null) throw new Error('"value" is required for field mapping, if not needed specify empty string: ', m)
    if (value === '') console.warn('"value" is empty, not recommended', m);

    let v;
    if (typeof value === 'string') {
      v = rec[value];
      if (!rec.hasOwnProperty(value)) {
        throw new Error(`property "${value}" is not found.`, m);
      }
    } else if (typeof (value) === 'function') {
      v = value(rec);
    } else {
      throw new Error('mapper value could be string => "ColumnName" or function which is mapper func. if you want const value, put in mapper func 1st param')
    }

    // it means value is string
    if (m.length) {
      v = v + ''
      if (m.length < v.length)
        throw new Error(`value "${value}" is longer than ${m.length} characters: `+ JSON.stringify(rec))
    }

    // skip empty name
    if (name !== '')
      r[name] = v;
  })

  return r;
}