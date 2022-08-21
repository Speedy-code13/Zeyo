class Event{
    constructor(client, name)
    {
        this.client = client
        this.name = name

        this._listener = this._run.bind(this)
        this.lang = "en"
    }

    async _run(...args)
    {
        try{
            await this.run(...args)
        }
        catch(err){
            console.log(err)
        }
    }

    startListener()
    {
        this.client.on(this.name,  this._listener);
    }

    stopListener()
    {
        this.client.off(this.name, this._listener);
    }

    sendEmbed(message, string, embedType, ...vars)
    {
        message.channel.send({embeds:[this.client.embeds.get(embedType)(this.client.getLocale(this.lang, string, vars), this.lang)]})
    }
 
}

export default Event