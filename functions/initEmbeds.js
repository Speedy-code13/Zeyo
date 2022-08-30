import {MessageEmbed} from 'discord.js'

export default function initEmbeds(client)
{
    client.embeds.set('help', (string, lang) => {
        const fields = []
        client.commands.forEach((command, commandName) => {
            if(commandName == 'help') return
            fields.push({
                name: `${client.prefix}${commandName}`,
                value: client.getLocale(lang, commandName + '_desc')
            })
        });
        let embed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle('All Commands')
        .addFields(fields)   
        return embed
    })

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
            usage: `${client.prefix}rr add/remove [channel] [message id] [role] [emoji]\n${client.prefix}rr [channel] [message id] setEmojiLimit [1-99]`,
            example: `${client.prefix}rr add/remove #general 992092550179594360 @cowboy 🤠`,
            commandName : 'rr'
        }
        return helpEmbed(client, args, lang)
    })
    client.embeds.set('rrs_help', (description, lang) => {
        const args = {
            description:description,
            usage: `${client.prefix}rrs emojilimit [message id] [1-99]`,
            example: `${client.prefix}rrs emojilimit 992092550179594360 1`,
            commandName : 'rrs'
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
            usage: `${client.prefix}links on/off [channel]\n${client.prefix}links on/off default(rule for channels by default)`,
            example: `${client.prefix}links on/off #general\n${client.prefix}links off default`,
            commandName : 'links'
        }
        return helpEmbed(client, args, lang)
    })

    client.embeds.set('autor_help', (description, lang) => {
        const args = {
            description:description,
            usage: `${client.prefix}autor add/remove [role](time_to_remove_it)\n${client.prefix}autor removeAll`,
            example: `${client.prefix}autor add/remove @cowboy\n${client.prefix}autor add @newmember 12h/s/m\n${client.prefix}autor removeAll`,
            commandName : 'autor'
        }
        return helpEmbed(client, args, lang)
    })

    client.embeds.set('welcomemsg_help', (description, lang) => {
        const args = {
            description:description,
            usage: `${client.prefix}welcomemsg on [channel]\n${client.prefix}welcomemsg off`,
            example: `${client.prefix}welcomemsg on #welcome\n${client.prefix}welcomemsg off`,
            commandName : 'welcomemsg'
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