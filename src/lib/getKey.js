export default function getKey(type, id, unique = 'asdf1234!@#$') {
  return [type, id, unique].join("|");
}