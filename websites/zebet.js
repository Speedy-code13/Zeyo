import { match } from "assert";
import { machine } from "os";
import { By } from "selenium-webdriver";
export default async function zebet(driver, client, webdriver){
   const links = await getMatchesLinks(driver)
   
   const matches = new Array()

   for(const link of links){
        const matchesOnALink = await getMatchesEmbedsFromLink(client, webdriver, driver, link)
        for(const match of matchesOnALink){
            matches.push(match)
        }
   }

   return matches
}
async function getMatchesEmbedsFromLink(client,webdriver, driver, link){
   // await driver.get('C:/Developer/Node/Zeyo/testfiles/France - Parier sur France, Super Cotes, les cotes, les matchs en direct et à venir.html')
   await driver.get(link)
    //await driver.get('C:/Developer/Node/Zeyo/testfiles/NBA - Parier sur NBA, Super Cotes, les cotes, les matchs en direct et à venir.html')
    //await driver.get('C:/Developer/Node/Zeyo/testfiles/International - Parier sur International, Super Cotes, les cotes, les matchs en direct et à venir.html')
    const matchesContainers = await driver.findElements(By.className("item-content catcomp item-bloc-type-13"))
    const matchTreeContainer = await driver.findElement(By.className("uk-breadcrumb green"))
    const matchTree = await matchTreeContainer.findElements(By.className("uk-active"))

    let matchCategory = ""
    for(let i = 1; i < matchTree.length; i ++){
        matchCategory += await matchTree[i].getText()
        if(i != matchTree.length - 1)
            matchCategory += " - "
    }
    const matchesData = new Map()
    for(const matchContainer of matchesContainers){
       
        try{
            var[matchDescription] = await Promise.all([
                matchContainer.findElement(By.className("bet-question")).getAttribute("innerText"),
            ])

            var boostedOdds = parseOdds(matchDescription)
    
        } catch(error){
            console.log(error);
            return null;
        }

        const matchDataString = matchCategory + matchDescription + boostedOdds

        const matchDataEmbed = client.embeds.get('zebet')(matchCategory, matchDescription, boostedOdds, link)
    
        matchesData.set(matchDataString, matchDataEmbed)
    }

    const matches = webdriver.matchesThatCanBeSent('parionssport', matchesData)
    return Array.from(matches?.values())

}
async function getMatchesLinks(driver){
    // await driver.get('C:/Developer/Node/Zeyo/testfiles/super cotes - Parier sur super cotes, les cotes, les matchs en direct et à venir.html')
    await driver.get("https://www.zebet.fr/fr/sport/71-super_cotes")
    const links = new Array()
    try{
        var boostedGamesContainer = await driver.findElement(By.className("uk-accordion-wrapper"))

    } catch(error){console.log(error); return }

    let boostedGames = await boostedGamesContainer.findElements(By.xpath("./child::*"))
    //skipping 2 useless elements
    for(let i = 2; i < boostedGames.length; i++){
        const boostedTeamsContainer = await boostedGames[i].findElement(By.className("uk-list uk-list-line uk-margin-top uk-text-bold uk-text-uppercase"))
        let boostedTeams = await boostedTeamsContainer.findElements(By.xpath("./child::*"))

        for(const boostedTeam of boostedTeams) {
            const anchors = await boostedTeam.findElements(By.css("a"))

            for(const anchor of anchors){
                const link =  await anchor.getAttribute("href")
                links.push(link)
            }
        }
    }
    return links
}


function parseOdds(matchDescription){
    const numberOfOddsCharacters = 11;
    if(matchDescription.length > numberOfOddsCharacters) return "N/A"

    return matchDescription.substr(matchDescription.length - numberOfOddsCharacters, matchDescription.length)
}
