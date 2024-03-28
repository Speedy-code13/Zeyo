import { match } from "assert";
import { machine } from "os";
import { By } from "selenium-webdriver";

export default async function zebet(driver, client){

    try{ var boostedOddsMatchContainer = await driver.findElement(By.className("item-content uk-width-1-1 supercote-container")) }
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
    try{
        var[sportName, matchName, matchCondition, odds] = await Promise.all([
            match.findElement(By.className("supercotes-flag-title")).getText(),
            match.findElement(By.className("supercotes-flag-subtitle")).getText(),
            match.findElement(By.className("supercotes-flag-libelle")).getText(),
            match.findElement(By.className("pmq-cote uk-width-1-1")).getText()
        ])
    }

    catch{
        console.log(error);
        return null;
    }
       
    const matchDataString =  sportName + matchName + matchCondition + odds
    const oddsArray = odds.split(" ")
    var matchDataEmbed = client.embeds.get('zebet')(sportName, matchName, matchCondition, oddsArray[0], oddsArray[1])

    matchesData.set(matchDataString, matchDataEmbed)
}