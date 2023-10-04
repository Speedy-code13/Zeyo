import {By, Builder} from 'selenium-webdriver'

export default async function parionssport(driver, client)
{
    await driver.get('https://www.enligne.parionssport.fdj.fr/cotes-boostees')
    
    try{ 
        const termsAndConditionsButton = await driver.findElement(By.id("popin_tc_privacy_button_2"))
        await termsAndConditionsButton.click()

    }
    catch(error) {return null}


    const matchesData = new Map()

    try{
        var noBetsAvailableElement = await driver.findElement(By.className("psel-no-event"))
    }
    catch{
        await updateMatchesData(matchesData, driver, client)
        
        return matchesData
    }
    
    return null
}

async function parseMatchNameFromScoreboard(scoreboard){
    const opponents = await scoreboard.findElements(By.className("psel-opponent__name"))

    if(opponents?.length == 0) return "Null"

    let matchName = await opponents[0].getText()

    for(let i = 1; i < opponents.length; ++i){
        matchName += " vs "
        matchName += await opponents[i].getText()
    }


    return matchName
}

async function updateMatchesData(matchesData, driver, client) 
{
    try{
        var[matchTimes, matchDescriptions, scoreboards, boostedOdds, matchConditions] = await Promise.all([
            driver.findElements(By.className("psel-timer")),
            driver.findElements(By.className("psel-bet-option")), 
            driver.findElements(By.className("psel-scoreboard")), 
            driver.findElements(By.className("psel-outcome__data")),
            driver.findElements(By.className("psel-market__label")),
         ])
         
    } catch(error){
        console.log(error);
        return null;
    }
     for(let i = 0; i < matchTimes.length; ++i){
        let matchTime = await matchTimes[i].getText()

        let matchName = await parseMatchNameFromScoreboard(scoreboards[i])
        let matchDescription = await matchDescriptions[i].getText()
        let boostedOdd = await boostedOdds[i].getText()
        let matchCondition = await matchConditions[i].getText()

        const matchDataString = matchTime + matchName + matchDescription + boostedOdd + matchCondition
        const matchDataEmbed = client.embeds.get('parionssport')(matchTime, matchName, matchDescription, boostedOdd, matchCondition)

        matchesData.set(matchDataString, matchDataEmbed)
     }
    


}