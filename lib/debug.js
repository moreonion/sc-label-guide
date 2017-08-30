export default function debug(label, obj) {
  console.log(`${label.toUpperCase()} ==> ${JSON.stringify(obj)}`)
}
