import capitalizeFirstLetter from './capitalizeFirstLetter.js'

export function getParsedWebsiteName(websiteName) {
    const websiteThreadName = capitalizeFirstLetter(websiteName);

    if(websiteThreadName == 'Parionssport') websiteThreadName = 'Parions Sport';
    if(websiteThreadName == 'Winamax_gold') websiteThreadName = 'Winamax Gold';

    return websiteThreadName
}
