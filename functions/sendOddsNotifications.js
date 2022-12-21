import { ThreadMemberFlags } from 'discord.js';
import {By, Builder} from 'selenium-webdriver'
import BoostedOddsModel from '../models/BoostedOddsModel.js'
import createOrGetThread from './createOrGetThread.js'
import getParsedWebsiteName from './getParsedWebsiteName.js';
import logProcessUsagePercentage from './logProcessUsagePercentage.js';

export default async function sendOddsNotifications(client)
{
    const boostedOddsModels = await BoostedOddsModel.find();

    boostedOddsModels.forEach(async (boostedOddsModel) => {

        const channel = client.channels.cache.get(boostedOddsModel.channel_id);

        if(channel == null) return;

        boostedOddsModel.role_for_website.forEach(async (role_id, website) => {
            try{
                const role = channel.guild.roles.cache.get(role_id);
        
                if(role == null) return;
        
                const matchesDataEmbeds = await client.webdriver.getOdds(website, client);

                if(!matchesDataEmbeds?.length) return;

                //Specific winamax behaviour(different behaviour for golden boosts)
                if(await handleWinamaxBehaviour(matchesDataEmbeds, channel, website, boostedOddsModel.role_for_website)) return;
        
                //Every other behaviour
                const thread = await createOrGetThread(getParsedWebsiteName(website), channel);
                
                if(thread == null) return 

                await thread.send(`<@&${role_id}>`)

                for(const embed of matchesDataEmbeds)
                {
                    thread.send({embeds: [embed]})
                    .catch(error =>{
                        console.log(error.message)
                    })
                }
            }
            catch{
                console.log(error);
                return;
            } 
        })
    });
}

/**
 * 
 * Separates normal odds boosts from the golden odds boosts(wnamaxl)
 * */
function filterWinamaxEmbeds(matchDataEmbeds)
{
    const embeds = { winamaxGold: new Array(), winamax : new Array() };

    for(const embed of matchDataEmbeds)
    {
       if(embed.title.toLowerCase().includes("la grosse cote"))
            embeds.winamaxGold.push(embed);

       else
            embeds.winamax.push(embed);
    }

    return embeds
}

async function handleWinamaxBehaviour(matchesDataEmbeds, channel, website, role_for_website)
{
    if(!(website?.toLowerCase() == 'winamax')) return false

    var embeds = filterWinamaxEmbeds(matchesDataEmbeds)
    const threadWinamax = await createOrGetThread(getParsedWebsiteName('winamax'), channel)

    await threadWinamax.send(`<@&${role_for_website.get('winamax')}>`)

    for(const embed of embeds.winamax)
    {
        threadWinamax.send({embeds: [embed]})
    }
 
    //Handle golden odds on winamax
    if(embeds.winamaxGold.length != 0)
    {
        const threadWinamaxGold = await createOrGetThread(getParsedWebsiteName('winamax_gold'), channel)

        await threadWinamaxGold.send(`<@&${role_for_website.get('wimamax_gold')}>`)

        for(const embed of embeds.winamaxGold)
        {
            threadWinamaxGold.send({embeds: [embed]})
        }
    }

    return true
}