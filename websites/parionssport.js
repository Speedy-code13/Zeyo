import {By, Builder} from 'selenium-webdriver'

export default async function parionssport(driver, client, webdriver)
{
    await driver.get('https://www.enligne.parionssport.fdj.fr/cotes-boostees')
    
    try{ 
        const termsAndConditionsButton = await driver.findElement(By.id("popin_tc_privacy_button_2"))
        await termsAndConditionsButton.click()

        var boostedOddsMatchContainer = await driver.findElement(By.className("psel-sport__events")) 
    }
    catch(error) {console.log(error); return null}
    
    const boostedOddsMatches = await boostedOddsMatchContainer.findElements(By.xpath("./child::*"))

    const matchesData = new Map()

    try{
        var noBetsAvailableElement = await driver.findElement(By.className("psel-no-bet")) 
    }
    catch{
        for(let i = 1; i < boostedOddsMatches.length; i++)
        {
            await updateMatchesData(matchesData, boostedOddsMatches[i], client)
        }
    
        
        const matches = webdriver.matchesThatCanBeSent('parionssport', matchesData)
        return Array.from(matches?.values())
    }
    
    return null
}

async function updateMatchesData(matchesData, match, client) 
{
    try{
        var[matchTime, matchDescription, matchName, boostedOdds, matchCondition] = await Promise.all([
            match.findElement(By.className("psel-block-info-match__hour")).getText(),
            match.findElement(By.className("psel-bet-option")).getText(), 
            match.findElement(By.className("psel-match__label")).getText(), 
            match.findElement(By.className("psel-outcome__data")).getText(),
            match.findElement(By.className("psel-market__label")).getText(),
         ])

    } catch(error){
        console.log(error);
        return null;
    }
     
    const matchDataString = matchTime + matchName + matchDescription + boostedOdds + matchCondition

    const matchDataEmbed = client.embeds.get('parionssport')(matchTime, matchName, matchDescription, boostedOdds, matchCondition)

    matchesData.set(matchDataString, matchDataEmbed)
}