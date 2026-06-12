const winston = require('winston');
require('dotenv').config();

const logLevel = process.env.LOG_LEVEL || 'info';

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'total-lakay-backend' },
  transports: [
    // Error logs
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // All logs
    new winston.transports.File({ filename: 'logs/combined.log' }),
    // Console (human readable)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, service }) => {
          return `${timestamp} [${service}] ${level}: ${message}`;
        })
      )
    })
  ]
});

module.exports = logger;
