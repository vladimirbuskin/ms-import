export default function range(from, to, step = 1) {
  if (to == null) 
  {
    to = from;
    from = 1;
  }
  return (new Array(to - from + 1)).fill().map((x,i) => from + i*step)
}