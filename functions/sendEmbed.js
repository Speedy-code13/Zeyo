export default function sendEmbed(lang, client, message, string, embedType, ...vars)
{
    message.channel.send({embeds:[client.embeds.get(embedType)(client.getLocale(lang, string, vars), lang)]})
}