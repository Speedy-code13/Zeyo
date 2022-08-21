import {MessageEmbed} from 'discord.js'

export default function initEmbeds(client)
{
    client.embeds.set('error', (string, lang) => {
        let embed = new MessageEmbed()
        .setColor('RED')
        .setDescription( '😑  ' + string)
        return embed
    })
    client.embeds.set('success', (string, lang) => {
        let embed = new MessageEmbed()
        .setColor('GREEN')
        .setDescription( '😎  ' + string)
        return embed
    })

    client.embeds.set('setlang_help', (description, lang) =>{
        const args = {
            description: description,
            usage: `${client.prefix}setlang [language]{fr, en}`,
            example: `${client.prefix}setlang en`,
            commandName : 'setlang'
        }
        return helpEmbed(client, args, lang)
    })

    client.embeds.set('rr_help', (description, lang) => {
        const args = {
            description:description,
            usage: `${client.prefix}rr add/remove [channel] [message id] [role] [emoji]`,
            example: `${client.prefix}rr add/remove #general 992092550179594360 @cowboy 🤠`,
            commandName : 'rr'
        }
        return helpEmbed(client, args, lang)
    })

    client.embeds.set('rrd_help', (description, lang) => {
        const args = {
            description:description,
            usage: `${client.prefix}rr [message id]`,
            example: `${client.prefix}rrd 992092550179594360`,
            commandName : 'rrd'
        }
        return helpEmbed(client, args, lang)
    })

    client.embeds.set('svstats_help', (description, lang) => {
        const args = {
            description:description,
            usage: `${client.prefix}svstats on/off`,
            example: `${client.prefix}svstats on\n${client.prefix}svstats off`,
            commandName : 'svstats'
        }
        return helpEmbed(client, args, lang)
    })

    client.embeds.set('links_help', (description, lang) => {
        const args = {
            description:description,
            usage: `${client.prefix}links on/off [channel]\n${client.prefix}links on/off everywhere(rule for all channels)`,
            example: `${client.prefix}links on/off #general\n${client.prefix}links off everywhere`,
            commandName : 'links'
        }
        return helpEmbed(client, args, lang)
    })
}

function helpEmbed(client, args, lang)
{
    var embed = new MessageEmbed()
    .setColor('BLUE')
    .setTitle('Command: ' + client.prefix + args.commandName)
    .setDescription(`**Description:** ${args.description}`)
    .addFields([
        {
            name: client.getLocale(lang, 'usage'),
            value : args.usage    
        },
        {
            name: client.getLocale(lang, 'example'),
            value: args.example
        }

        ]
    )
    return embed
}