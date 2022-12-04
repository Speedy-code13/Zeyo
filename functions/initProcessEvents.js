import log from './logger.js'

export default function initProcessEvents()
{
    process
    .on('unhandledRejection', (reason, promise) =>{
        console.log(reason, 'Unhandled rejection at Promise', promise)
        log(promise)
    })
    .on('uncaughtException', error =>{
        console.log(error, 'Uncaught exception thrown')
        log(error)
    })

}