import path from "path"
import { fileURLToPath} from "url"
import fs from "fs"
import GuildSettingsModel from "../models/GuildSettingsModel.js";
import {Client, Collection, MessageEmbed } from "discord.js"
import initEmbeds from "../functions/initEmbeds.js";
import createStatsInterval from "../functions/createStatsInterval.js";
import WebDriver from "./WebDriver.js";
import mongoose  from "mongoose";
import createOddsNotificationsInterval from "../functions/createOddsNotificationsInterval.js";
import getFiles from "../functions/getFiles.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url))                      

class Bot extends Client {
    constructor(args)
    {
        super(args)
            
        this.prefix = args.prefix
        this.commands = new Collection()
        this.statsIntervals = new Collection()
        this.events = new Collection()
        this.languages = new Map()
        this.embeds = new Map()
        this.defaultLang = "en"
        this.webdriver = new WebDriver()

        createOddsNotificationsInterval(this)

        initEmbeds(this)
        this.initStatsIntervals()
    }

    async start(token) 
    {
        await super.login(token)
    }

    loadEvents()
    {
        getFiles(`${this, __dirname}/../events/`).forEach(async (eventFileName) =>
        {
            const eventName = eventFileName.split(".js")[0]
            const Event = (await import(`../events/${eventFileName}`)).default
            const event = new Event(this, eventName)
            event.startListener()
            this.events.set(eventName, event)
        })
    }
    getLocale(language, string, ...vars)
    {
        let locale = this.languages.get(language)[string];

        if(locale == null) return "string missing in current language(development bug)"

        let count = 0;
        locale = locale.replace(/%VAR%/g, () => vars[count] !== null ? vars[count] : "%VAR%");

         return locale;
    }

    loadCommands()
    {
        getFiles(`${this, __dirname}/../commands/`).forEach(async (commandFileName) =>
        {
            const commandName = commandFileName.split(".js")[0]
            const Command = (await import(`../commands/${commandFileName}`)).default
            const command = new Command(this, commandFileName)
            this.commands.set(commandName, command)
        })
    }
    loadLanguages()
    {
        getFiles(`${this, __dirname}/../languages/`).forEach(async (languageFileName) =>
        {
            const languageName = languageFileName.substring(5, languageFileName.length - 3)
            const language = (await import(`../languages/${languageFileName}`)).default
            this.languages.set(languageName, language)
        })
    }

    getCommand(commandName)
    {
        return this.commands.get(commandName?.split(" ")[0]?.toLowerCase())
    }

    async getGuildSettings(guild)
    {
        var guildSettings = await GuildSettingsModel.findOne({guild_id: guild.id})
        if(guildSettings == null)
        {
            var userSchema = {guild_id:guild.id, auto_roles: new Map()}
            guildSettings = new GuildSettingsModel(userSchema)
            await guildSettings.save()
        }
        return guildSettings
    }

    async initStatsIntervals()
    {   
        const guildsSettings = await GuildSettingsModel.find()

        guildsSettings.forEach(async (guildSettings) =>{
            if(guildSettings.stats_channel_id == null) return

            const interval = createStatsInterval(this, guildSettings)

            this.statsIntervals.set(guildSettings.id, interval)
            
        })
    }
}

export default Bot