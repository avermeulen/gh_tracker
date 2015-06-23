var winston = require('winston');

winston.add(winston.transports.File, { filename: "./logs/gh_tracker.log" });
winston.info('Chill Winston, the logs are being captured...');

module.exports=winston;