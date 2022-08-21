export default function sendEmbed(client, message, string, embedType, ...vars)
{
    message.channel.send({embeds:[client.embeds.get(embedType)(this.getLocale(string, vars), this.lang)]})
}