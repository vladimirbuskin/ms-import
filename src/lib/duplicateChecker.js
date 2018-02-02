export default function(array, check, transform = d => d) {
  let map = {};
  let duplicates = {};

  if (check == null) throw new Error('"array" is required.');
  if (check == null) throw new Error('"check" parameter is required.');

  array.map(r => {
    let v = null;
    if (typeof(check) === 'string') {
      v = r[check];
    }
    else {
      v = check(r);
    }

    map[v] = map[v] || [];
    map[v].push(r);
  })

  Object.keys(map).forEach(function (v) {
    let ar = map[v];
    if (ar.length > 1) {

      if (Array.isArray(transform))
      {
        ar = ar.map(function(d) {
          let c = {};
          transform.map(k => c[k] = d[k])
          return c;
        })
      }
      else 
      {
        ar = ar.map(transform)
      }

      duplicates[v] = ar
    }
  })

  // no duplicates
  if (Object.keys(duplicates).length == 0) 
    return null;
  
  // return duplicates map.
  return duplicates;
}