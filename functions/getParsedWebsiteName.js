import capitalizeFirstLetter from './capitalizeFirstLetter.js'

export default function getParsedWebsiteName(websiteName) {
    let websiteThreadName = capitalizeFirstLetter(websiteName);

    if(websiteThreadName == 'Parionssport') websiteThreadName = 'Parions Sport';
    if(websiteThreadName == 'Winamax_gold') websiteThreadName = 'Winamax Gold';

    return websiteThreadName
}
