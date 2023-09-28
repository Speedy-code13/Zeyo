import {By} from 'selenium-webdriver'

export default async function netbet(driver, client){

    const sportsLinks = await getSportsLinks(driver)

    if(sportsLinks == null) return null;

    const matchesData = new Map()

    for(let i = 0; i < sportsLinks.length; ++i){

        await updateMatchesData(client, driver, matchesData, sportsLinks[i])
    }

    return matchesData
}

async function updateMatchesData(client, driver, matchesData, sportLink){
    await driver.get(sportLink)

    var boostedOddsMatchContainer = await driver.findElement(By.css("div.oddslist"))

    const daysOfMatches = await boostedOddsMatchContainer.findElements(By.className("nb-event_datestart"))
    const hoursOfMatches = await boostedOddsMatchContainer.findElements(By.className("nb-event_timestart"))
    const conditionsOfMatches = await boostedOddsMatchContainer.findElements(By.className("label"))

    const choicesOfMatches = await boostedOddsMatchContainer.findElements(By.className("nb-odds_choice"))
    const choicesAmountsOfMatches = await boostedOddsMatchContainer.findElements(By.className("nb-odds_amount"))

    const categoryName = getMatchCategoryParsedName(sportLink)

    let choicesIndex = 0
    for(let i = 0; i < conditionsOfMatches.length; ++i){
        const day = await daysOfMatches[i].getText()
        const hour = await hoursOfMatches[i].getText()
        const condition = await conditionsOfMatches[i].getText()
        
        const choice1OfMatch = await choicesOfMatches[choicesIndex].getText()
        const choice1AmountOfMatch = await choicesAmountsOfMatches[choicesIndex].getText()

        ++choicesIndex

        const choice2OfMatch = await choicesOfMatches[choicesIndex].getText()
        const choice2AmountOfMatch = await choicesAmountsOfMatches[choicesIndex].getText()

        ++choicesIndex

        const matchString = day + hour + condition + choice1AmountOfMatch + choice2AmountOfMatch

        const matchEmbed = client.embeds.get('netbet')(categoryName, sportLink, day, hour, condition, choice1OfMatch, choice1AmountOfMatch, choice2OfMatch, choice2AmountOfMatch)

        matchesData.set(matchString, matchEmbed)
    } 

 
}

function getMatchCategoryParsedName(link){
    const unparsedCategoryName = link.split("/")[4]

    const wordsInTheName = unparsedCategoryName.split("-")

    let parsedCategoryName = ""

    for(let i = 0; i < wordsInTheName.length; ++i){
        parsedCategoryName += (wordsInTheName[i][0].toUpperCase() + wordsInTheName[i].slice(1)) + ' '
    }

    return parsedCategoryName

}

async function getSportsLinks(driver){

    await driver.get("https://www.netbet.fr/super-cotes")

   
    try{ var boostedOddsMatchContainer = await driver.findElement(By.id("competitions-block")) }
    catch(error){console.log(error); return null} 
    
    var topCategories = await boostedOddsMatchContainer.findElement(By.className("uk-accordion"))
   // const boostedOddsMatches = await boostedOddsMatchContainer.findElements(By.xpath("./child::*"))
    var links = await topCategories.findElements(By.css("a"));

    const sportsLinks = []

    for(let i = 1; i < links.length; i += 2){
        sportsLinks.push(await links[i].getAttribute("href"))
    }

    return sportsLinks.length ? sportsLinks : null
    
}