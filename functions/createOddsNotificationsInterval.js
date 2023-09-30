import sendOddsNotifications from "./sendOddsNotifications.js";

export default function createOddsNotificationsInterval(client)
{
    const timer = setInterval(async () =>{
        sendOddsNotifications(client)
    }, 1000 * 60 * 1)

    return timer
} 