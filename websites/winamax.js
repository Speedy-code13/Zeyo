import {By, Builder} from 'selenium-webdriver'

export default async function winamax(driver, client)
{  
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
    const spans = await match.findElements(By.css("span"))
    const divs = await match.findElements(By.css("div"))

    // for(var i = 0; i < divs.length; ++i)
    // {
    //     try
    //     {
    //         console.log(i + " " + await divs[i].getText())
    //     }
    //     catch
    //     {

    //     }
    // }


    try{
        var[matchName, matchCondition, matchTime, initialOdds, boostedOdds] = await Promise.all([
            divs[18].getText(),
            divs[19].getText(),
            spans[1].getText(),
            spans[2].getText(),
            spans[3].getText()
        ])  
        
    } catch(error){
        console.log(error);
        return null;
    }
    
    const matchDataString =  matchName + matchCondition + initialOdds + boostedOdds

    if(matchName.toLowerCase().includes("la grosse cote"))
        var matchDataEmbed = client.embeds.get('winamax_gold')(matchTime, matchName, matchCondition, initialOdds, boostedOdds)

    else
        var matchDataEmbed = client.embeds.get('winamax')(matchTime, matchName, matchCondition, initialOdds, boostedOdds)

    matchesData.set(matchDataString, matchDataEmbed)
}