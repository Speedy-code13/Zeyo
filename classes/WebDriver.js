import {By, Builder} from 'selenium-webdriver'
import {Options} from 'selenium-webdriver/chrome'

class WebDriver{
    constructor()
    {
        this.alreadySentMatches = []    
        this.supportedWebsites = new Map()
        const supportedWebsitesNames = ['winamax', 'winamaxgold', 'betlic', 'zebet', 'unibet', 'parionssport']
        supportedWebsitesNames.forEach(website => this.supportedWebsites.set(website, this[website]))
    }
    async getOdds(website)
    {
        if(!this.supportedWebsites.has(website)) return null
        var options = new chrome.Options().headless()
        options = options.addArguments('--headless", "--disable-gpu", "--window-size=1920,1080","--ignore-certificate-errors","--disable-extensions","--no-sandbox","--disable-dev-shm-usage')
        const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build()

        try{
            var rawMatches = await this.supportedWebsites.get(website)(driver)
        } catch(err){
            console.log(err)
            driver.quit()
        } 
  
        const matches = this.matchesThatCanBeSent(rawMatches)

        console.log(matches)
        return matches
    }
    async winamax(driver)
    {
        return await this.winamax_raw(driver)
    }
    async winamaxgold(drver)
    {
        return await this.winamax_raw(driver)
    }
    async betclic(driver)
    {
        return null
    }
    async zebet(driver)
    {
        return null
    }
    async unibet(driver)
    {
        return null
    }
    async parionssport(driver)
    {
        return null
    }
    async winamax_raw(driver)
    {
        await driver.get('https://www.winamax.fr/paris-sportifs/sports/100000')
        
        try{ var boostedOddsMatchContainer = await driver.findElement(By.className("ReactVirtualized__Grid__innerScrollContainer")) }
        catch(doesntHaveList) {return null}
        
        const boostedOddsMatches = await boostedOddsMatchContainer.findElements(By.xpath("./child::*"))

        const matchesData = new Array(boostedOddsMatches.length)

        for(const match of  boostedOddsMatches)
        {
            try{
                const matchTime = await match.findElement(By.className("sc-dwVMhp eFGtpm")).getText()
                const matchName = await match.findElement(By.className("sc-cMdCKn iKujpm")).getText()
                const matchCondition  = await match.findElement(By.className("sc-gkIbIe iFRQGL")).getText()
                const initialOdds = await match.findElement(By.className("sc-hYEWHb iUdrlB")).getText()
                const boostedOdds = await match.findElement(By.className("sc-hYEWHb ffRzXm")).getText()
                const matchData = '------------------------------------------------------------' + '\n' + matchTime + '\n' + matchName + '\n' + matchCondition + '\n' + initialOdds + '\n' + boostedOdds + '\n'
                matchesData.push(matchData)
            }
            catch(err){
                continue
            }
          
        }
        return matchesData  
    }

    matchesThatCanBeSent(matches)
    {
        const matchesThatCanBeSent = []
        if(matches == null) return matchesThatCanBeSent
        matches.forEach(match =>{
            if(this.alreadySentMatches.includes(match)) return
         
            matchesThatCanBeSent.push(match)
            this.alreadySentMatches.push(match)
        })
        return matchesThatCanBeSent
    }
    
}

export default WebDriver