import winston from 'winston/lib/winston.js';

 const logConfiguration = {
    transports: [
      new winston.transports.File({
    'name': 'error-file',
    'level': 'error',
    'filename': './logs/error.log',
    'json': false,
    'datePattern': 'yyyy-MM-dd-',
    'prepend': true
      })
    ]
  }
  const errorLogger = new winston.createLogger(logConfiguration)
  
 function log(error)
 {
    errorLogger.error(`${error}`)
 }
  
  export default log