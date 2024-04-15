import {By, Builder} from 'selenium-webdriver'

export default async function unibet(driver, client)
{
    
    try{ var boostedOddsMatchContainer = await driver.findElement(By.className("sbc-container sbc-container-desktop")) }
    catch(error) {console.log(error); return null}
    
    const boostedOddsMatches = await boostedOddsMatchContainer.findElements(By.xpath("./child::*"))

    const matchesData = new Map()

    for(const match of boostedOddsMatches)
    {
        await updateMatchesData(matchesData, match, client)
    }

    return matchesData
}

async function updateMatchesData(matchesData, match, client) 
{
    const getTime = async() => {
        const elements = await match.findElements(By.className("truncate"))
        const time = await elements[1].getText()
        return time
    }

    try{
        var[matchTime, matchCondition, league, teams, initialOdds, boostedOdds] = await Promise.all([
            getTime(),
            match.findElement(By.className("scb-card-selection-title")).getText(), 
            match.findElement(By.className("scb-league-title truncate")).getText(), 
            match.findElement(By.className("scb-card-title truncate")).getText(),
            match.findElement(By.className("old-odd-box")).getText(),
            match.findElement(By.className("new-odd-box")).getText()
        ])
        
    } catch(error){
        console.log(error);
        return null;
    }

    const matchName = `${league} - ${teams}`

    const matchDataString = matchTime + matchName + matchCondition + initialOdds + boostedOdds

    const matchDataEmbed = client.embeds.get('unibet')(matchTime, matchName, matchCondition, initialOdds, boostedOdds)

    matchesData.set(matchDataString, matchDataEmbed)

}