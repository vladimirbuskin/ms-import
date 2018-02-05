export default function makeRefKey() {
  let key = null;
  let f = (v) => {

    if (v != null)
      key = v;

    return key;
  };
  f.key = true;
  return f;
}