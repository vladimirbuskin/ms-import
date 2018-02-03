export default function makeRefKey() {
  let key = null;
  return (v) => {

    if (v != null)
      key = v;

    return key;
  };
}