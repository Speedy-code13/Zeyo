import {By, Builder} from 'selenium-webdriver'
import BoostedOddsModel from '../models/BoostedOddsModel.js'
export default async function sendOddsNotifications(client)
{
    const boostedOddsModels = await BoostedOddsModel.find();

    boostedOddsModels.forEach(async (boostedOddsModel) => {
        const channel = client.channels.cache.get(boostedOddsModel.channel_id);
        if(channel == null) return;

        boostedOddsModel.role_for_website.forEach(async (role_id, website) => {
            const role = channel.guild.roles.cache.get(role_id);
            if(role == null) return;

            const matches = await client.webdriver.getOdds(website);

            channel.send(`@${role.name} - ${matches}`);

        })
    })
}