import {By, Builder} from 'selenium-webdriver'
import * as chrome from 'selenium-webdriver/chrome.js'
import getFiles from '../functions/getFiles.js'
import { fileURLToPath} from "url"
import path from "path"

const __dirname = path.dirname(fileURLToPath(import.meta.url))       

class WebDriver{
    constructor()
    {
        this.alreadySentMatches = new Map() 
        this.websites = new Map()
        this.loadWebsites()
    }

    loadWebsites()
    {
        getFiles(`${this, __dirname}/../websites/`).forEach(async (websiteFileName) =>
        {
            const websiteName = websiteFileName.split(".js")[0]
            const websiteFunction = (await import(`../websites/${websiteFileName}`)).default
            this.websites.set(websiteName, websiteFunction)
        })

        this.websites.set("winamax_gold", null)
    }

    async getOdds(website, client)
    {
        if(!this.websites.has(website)) return null

        var options = new chrome.Options().headless()

        options.excludeSwitches("enable-logging")

        options = options.addArguments("--headless", "--disable-gpu", "start-maximized","--ignore-certificate-errors","--disable-extensions","--no-sandbox","--disable-dev-shm-usage", "disable-infobars")

        const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build()
       // const driver = await new Builder().forBrowser("chrome").build()

        try{
            var matchesDataEmbeds = await this.websites.get(website)(driver, client, this)
            driver.quit()
        } catch(err){
            console.log(err)
            driver.quit()
        } 
  
        return matchesDataEmbeds
    }
 
    matchesThatCanBeSent(website, matches)
    {
        const matchesThatCanBeSent = new Map()

        if(matches == null) return matchesThatCanBeSent
        
        matches.forEach((matchEmbed, matchString) =>{
            
            if(!this.alreadySentMatches.get(website)) this.alreadySentMatches.set(website, new Map())

            if(this.alreadySentMatches.get(website).has(matchString)) return
         
            matchesThatCanBeSent.set(matchString, matchEmbed)
        }) 
        
        if(matchesThatCanBeSent.size != 0)
            this.alreadySentMatches.set(website, matchesThatCanBeSent)

        return matchesThatCanBeSent
    }
}

export default WebDriver