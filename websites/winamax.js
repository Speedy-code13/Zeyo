import {By, Builder} from 'selenium-webdriver'

export default async function winamax(driver, client)
{
    await driver.get('https://www.winamax.fr/paris-sportifs/sports/100000')
    
    try{ var boostedOddsMatchContainer = await driver.findElement(By.className("ReactVirtualized__Grid__innerScrollContainer")) }
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
        var[matchTime, matchName, matchCondition, initialOdds, boostedOdds] = await Promise.all([
            match.findElement(By.className("sc-geuGuN fOfBwL")).getText(),
            match.findElement(By.className("sc-gyIOMT lbyJKf")).getText(),
            match.findElement(By.className("sc-gYgiyK hRdfoS")).getText(),
            match.findElement(By.className("sc-hwByLP jOXrFA")).getText(),
            match.findElement(By.className("sc-hwByLP ucZsP")).getText()
        ])
        
    } catch(error){
        console.log(error);
        return null;
    }
    
    const matchDataString =  matchTime + matchName + matchCondition + initialOdds + boostedOdds

    if(matchName.toLowerCase().includes("la grosse cote"))
        var matchDataEmbed = client.embeds.get('winamax_gold')(matchTime, matchName, matchCondition, initialOdds, boostedOdds)

    else
        var matchDataEmbed = client.embeds.get('winamax')(matchTime, matchName, matchCondition, initialOdds, boostedOdds)

    matchesData.set(matchDataString, matchDataEmbed)
}