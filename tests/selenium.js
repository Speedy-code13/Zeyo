import * as chrome from 'selenium-webdriver/chrome.js'
import {By, Builder} from 'selenium-webdriver'

var chromeDriver;
async function buildWebdriver(){
    var options = new chrome.Options();

    options.excludeSwitches("enable-logging")

    options = options.addArguments("--headless=new", "--disable-gpu", "start-maximized","--ignore-certificate-errors","--disable-extensions","--no-sandbox","--disable-dev-shm-usage", "disable-infobars");
    chromeDriver = await new Builder().forBrowser("chrome").build()
  // this.chromeDriver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
}

await buildWebdriver();

await chromeDriver.get("https://www.google.com/")
