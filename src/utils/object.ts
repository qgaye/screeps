export const toString = (o: any): string => {
  let output = ""
  for (const k in o) {
    output += `${k}: ${o[k]}\n`
  }
  return output
}
