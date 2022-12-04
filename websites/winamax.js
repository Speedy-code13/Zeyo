import {By, Builder} from 'selenium-webdriver'

export default async function winamax(driver, client, webdriver)
{
    await driver.get('https://www.winamax.fr/paris-sportifs/sports/100000')
    
    try{ var boostedOddsMatchContainer = await driver.findElement(By.className("ReactVirtualized__Grid__innerScrollContainer")) }
    catch(error) {console.log(error); return null}
    
    const boostedOddsMatches = await boostedOddsMatchContainer.findElements(By.xpath("./child::*"))

    const matchesData = new Map()

    for(const match of boostedOddsMatches)
    {
        try{
            updateMatchesData(matchesData, match, client)
        }
        catch(err){
            console.log(err)
            continue
        }
        
    }
    const matches = webdriver.matchesThatCanBeSent('winamax', matchesData)
    return Array.from(matches?.values())
}

async function updateMatchesData(matchesData, match, client)
{
    const [matchTime, matchName, matchCondition, initialOdds, boostedOdds] = await Promise.all([
        await match.findElement(By.className("sc-dwVMhp eFGtpm")).getText(),
        await match.findElement(By.className("sc-kQUCNg cQEwjT")).getText(),
        await match.findElement(By.className("sc-bbfQMc jvzhVB")).getText(),
        await match.findElement(By.className("sc-gNltnM ehwpQe")).getText(),
        await match.findElement(By.className("sc-gNltnM hgibdF")).getText()
    ])

    const matchDataString =  matchTime + matchName + matchCondition + initialOdds + boostedOdds

    if(matchName.toLowerCase().includes("la grosse cote"))
        var matchDataEmbed = client.embeds.get('winamax_gold')(matchTime, matchName, matchCondition, initialOdds, boostedOdds)

    else
        var matchDataEmbed = client.embeds.get('winamax')(matchTime, matchName, matchCondition, initialOdds, boostedOdds)

    matchesData.set(matchDataString, matchDataEmbed)
}