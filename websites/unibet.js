import {By, Builder} from 'selenium-webdriver'

export default async function unibet(driver, client, webdriver)
{
    await driver.get('https://www.unibet.fr/sport/super-cotes-boostees')
    
    try{ var boostedOddsMatchContainer = await driver.findElement(By.className("sbc-container sbc-container-desktop")) }
    catch(error) {console.log(error); return null}
    
    const boostedOddsMatches = await boostedOddsMatchContainer.findElements(By.xpath("./child::*"))

    const matchesData = new Map()

    for(const match of boostedOddsMatches)
    {
        try{
            await updateMatchesData(matchesData, match, client)
        }
        catch(err){
            console.log(err)
            continue
        }
    }
    const matches = webdriver.matchesThatCanBeSent('unibet', matchesData)
    return Array.from(matches?.values())
}

async function updateMatchesData(matchesData, match, client) 
{
    const getTime = async() => {
        const elements = await match.findElements(By.className("truncate"))
        const time = await elements[1].getText()
        return time
    }

    const[matchTime, matchCondition, league, teams, initialOdds, boostedOdds] = await Promise.all([
        getTime(),
        match.findElement(By.className("scb-card-selection-title")).getText(), 
        match.findElement(By.className("scb-league-title truncate")).getText(), 
        match.findElement(By.className("scb-card-title truncate")).getText(),
        match.findElement(By.className("old-odd-box")).getText(),
        match.findElement(By.className("new-odd-box")).getText()])

    const matchName = `${league} - ${teams}`

    const matchDataString = matchTime + matchName + matchCondition + initialOdds + boostedOdds

    const matchDataEmbed = client.embeds.get('unibet')(matchTime, matchName, matchCondition, initialOdds, boostedOdds)

    matchesData.set(matchDataString, matchDataEmbed)

}