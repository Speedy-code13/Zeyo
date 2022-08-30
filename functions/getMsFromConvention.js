import isNumber from "./isNumber.js"

export default function getMsFromConvention(string)
{
    if(string == undefined || string.length < 2 || string.length > 8) return null
    const numberString = string.substr(0, string.length -1)
    if(!isNumber(numberString)) return null

    const number = parseInt(numberString) 

    if(string.charAt(string.length - 1).toLowerCase() == 's') return number * 1000
    if(string.charAt(string.length - 1).toLowerCase() == 'm') return number * 1000 * 60
    if(string.charAt(string.length - 1).toLowerCase() == 'h') return number * 1000 * 60 * 60
}

