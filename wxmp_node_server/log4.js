const log4js = require('log4js');
log4js.configure({
  appenders:  {
      out: { type: 'console' },
      log:{ type: 'dateFile', filename: 'logs/access.log', maxLogSize: 1024,backups:4,category: 'normal' }
  },
  categories: {
    default: { appenders: [ 'out', 'log' ], level: 'debug' }
  }
})

//app.use(log4js.connectLogger(this.logger('normal'), {level:'auto', format:':method :url'}));

const logger = (name) => {
  var logger = log4js.getLogger(name)
  return logger
}

module.exports = {
  logger : logger 
}