import {By, Builder} from 'selenium-webdriver'
import * as chrome from 'selenium-webdriver/chrome.js'
import getFiles from '../functions/getFiles.js'
import { fileURLToPath} from "url"
import path from "path"
import { match } from 'assert'

const __dirname = path.dirname(fileURLToPath(import.meta.url))       

class WebDriver{
    constructor()
    {
        this.alreadySentMatches = new Map() 
        this.websites = new Map()
        this.loadWebsites()
        this.chromeDriver = null
    }



    async buildWebdriver(){
        var options = new chrome.Options().headless()
 
        options.excludeSwitches("enable-logging")

        options = options.addArguments("--headless", "--disable-gpu", "start-maximized","--ignore-certificate-errors","--disable-extensions","--no-sandbox","--disable-dev-shm-usage", "disable-infobars")
        //this.chromeDriver = await new Builder().forBrowser("chrome").build()
        this.chromeDriver = await new Builder().forBrowser("chrome").setChromeOptions(options).build()
    }

    async getWebdriver(){
        if(this.chromeDriver == null){
            await this.buildWebdriver()
        }

        try {
            await this.chromeDriver.get("https://www.google.com/")
        } catch {
            await driver.quit()
            await this.buildWebdriver()
        } finally {
            return this.chromeDriver
        }

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

        const driver = await this.getWebdriver()

        try{
            var matchesData = await this.websites.get(website)(driver, client)
            var matchesDataEmbeds = this.matchesThatCanBeSent(website, matchesData)
            
        } catch(err){
            console.log(err)
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
        
        if(matchesThatCanBeSent.size != 0){
            const oldMatchesString = this.alreadySentMatches.get(website)
            if(oldMatchesString)
                 this.alreadySentMatches.set(website, new Map([...matchesThatCanBeSent, ...oldMatchesString]));
            else
                this.alreadySentMatches.set(website, matchesThatCanBeSent);
        }

        return Array.from(matchesThatCanBeSent?.values())
    }
}

export default WebDriver