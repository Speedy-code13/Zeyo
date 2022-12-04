export default async function createOrGetThread(name, channel) {
    var thread = channel.threads.cache.find(thread => thread.name.toLowerCase() === name.toLowerCase());
    if(thread) return thread;

    thread = await channel.threads.create({
        name: name,
        autoArchiveDuration: 60,
        reason: 'Thread created by bot'
    });
    return thread;
}