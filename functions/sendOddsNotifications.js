import {By, Builder} from 'selenium-webdriver'
import BoostedOddsModel from '../models/BoostedOddsModel.js'
import createOrGetThread from './createOrGetThread.js'
import { getParsedWebsiteName } from './getParsedWebsiteName.js';
export default async function sendOddsNotifications(client)
{
    const boostedOddsModels = await BoostedOddsModel.find();

    boostedOddsModels.forEach(async (boostedOddsModel) => {
        const channel = client.channels.cache.get(boostedOddsModel.channel_id);
        if(channel == null) return;

        boostedOddsModel.role_for_website.forEach(async (role_id, website) => {
                const role = channel.guild.roles.cache.get(role_id);
        
                if(role == null) return;
        
                var matchesDataEmbeds = await client.webdriver.getOdds(website, client);

                if(!matchesDataEmbeds?.length) return;

                if(await handleWinamaxBehaviour(matchesDataEmbeds, channel, website)) return
           
                const thread = await createOrGetThread(getParsedWebsiteName(website), channel);

                for(const embed of matchesDataEmbeds)
                {
                    thread.send({embeds: [embed]});
                }
        })
    });
    
}

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

async function handleWinamaxBehaviour(matchesDataEmbeds, channel, website)
{
    if(website?.toLowerCase() == 'winamax')
    {
        var embeds = filterWinamaxEmbeds(matchesDataEmbeds)
        const threadWinamax = await createOrGetThread(getParsedWebsiteName('winamax'), channel)

        for(const embed of embeds.winamax)
        {
            threadWinamax.send({embeds: [embed]})
        }

        if(embeds.winamaxGold.length != 0)
        {
            const threadWinamaxGold = await createOrGetThread(getParsedWebsiteName('winamax_gold'), channel)

            for(const embed of embeds.winamaxGold)
            {
                threadWinamaxGold.send({embeds: [embed]})
            }
        }
        return true
    }

    return false
}