export default function getMsFromConvention(string)
{
    if(string == undefined || string.length < 2 || string.length > 8) return null
    const numberString = string.substr(0, string.length -1)
    if(!onlyNumbers(numberString)) return null

    if(string[string.length] == 's') return numberString.toInt() * 1000
    if(string[string.length] == 'm') return numberString.toInt() * 1000 * 60
    if(string[string.length] == 'h') return numberString.toInt() * 1000 * 60 * 60
}

function onlyNumbers(str) {
    return /^[0-9]+$/.test(str);
  }