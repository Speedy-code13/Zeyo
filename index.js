import Database from "./classes/Database.js"
import Bot from "./classes/Bot.js"
import {Intents} from "discord.js"
import "dotenv/config"
import initProcessEvents from "./functions/initProcessEvents.js"
import { ExceptionHandler } from "winston/lib/winston.js"

initProcessEvents()
const database = new Database()

const client = new Bot({
    intents:[
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES
    ],
    prefix: ".",
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})

client.loadEvents()
client.loadCommands()
client.loadLanguages()

database.connect()
client.start(process.env.TOKEN)