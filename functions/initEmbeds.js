import {ClientPresence, ClientUser, MessageEmbed} from 'discord.js'

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
            usage: `${client.prefix}rr add/remove [channel] [message id] [role] [emoji]`,
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

    client.embeds.set('bodds_help', (description, lang) => {
        const args = {
            description:description,
            usage: `${client.prefix}bodds on [channel]\n${client.prefix}bodds off\n${client.prefix}bodds notifyrole [role] [betting website(winamax, winamaxgold, betlic, zebet, unibet, parionssport)]`,
            example: `${client.prefix}bodds on #boosted-odds\n${client.prefix}bodds off\n${client.prefix}bodds no   tifyrole @winamax winamax`,
            commandName : 'bodds'
        }
        return helpEmbed(client, args, lang)
    })

    client.embeds.set('universal_betting_website', (matchTime, matchName, matchCondition, initialOdds, boostedOdds, websiteLink, websiteColor) =>{
        const embed = new MessageEmbed()
                .setTitle(`${matchName}\n‎`)
                .setDescription(`${matchCondition}\n‎`)
                .addFields([
                    {
                        name: `~~${initialOdds}~~ ⇒ ${boostedOdds}`,
                        value: `‎`
                    }
                ])
                .setFooter({text:matchTime})
                .setURL(websiteLink)
                .setColor(websiteColor)
        return embed
    })

    client.embeds.set('winamax', (matchTime, matchName, matchCondition, initialOdds, boostedOdds) =>{
        return client.embeds.get('universal_betting_website')
        (matchTime, matchName, matchCondition, initialOdds, boostedOdds, "https://www.winamax.fr/paris-sportifs/sports/100000", "#e50914")
    })

    client.embeds.set('winamax_gold', (matchTime, matchName, matchCondition, initialOdds, boostedOdds) =>{
        return client.embeds.get('universal_betting_website')
        (matchTime, matchName, matchCondition, initialOdds, boostedOdds, "https://www.winamax.fr/paris-sportifs/sports/100000", "#f2cc00")
    })


    client.embeds.set('unibet', (matchTime, matchName, matchCondition, initialOdds, boostedOdds) =>{
        return client.embeds.get('universal_betting_website')
        (matchTime, matchName, matchCondition, initialOdds, boostedOdds, "https://www.unibet.fr/sport/super-cotes-boostees", "#147b45")
    })  

    client.embeds.set('parionssport', (matchTime, matchName, matchDescription, boostedOdds) =>{
        const embed = new MessageEmbed()
                .setTitle(`${matchName}\n‎`)
                .setDescription(`${matchDescription}\n‎`)
                .addFields([
                    {
                        name: boostedOdds,
                        value: `‎`
                    }
                ])
                .setFooter({text:matchTime})
                .setURL("https://www.enligne.parionssport.fdj.fr/cotes-boostees")
                .setColor("#004bc7")
        
        return embed
    })

    client.embeds.set('zebet', (matchCategory, matchDescription, boostedOdds, matchLink) =>{
        const embed = new MessageEmbed()
                .setTitle(`${matchCategory}\n‎`)
                .setDescription(`${matchDescription}\n‎`)
                .addFields([
                    {
                        name: boostedOdds,
                        value: `‎`
                    }
                ])
                .setURL(matchLink)
                .setColor("#bd1622")
        
        return embed
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