
// src/config/logger.js
import winston from 'winston';
import morgan from 'morgan';

// Configure Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Custom timestamp format
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ],
});

// Define custom Morgan token format for meaningful request logging
morgan.token('statusMessage', (req, res) => res.statusMessage || 'N/A');
morgan.token('client', (req) => req.headers['x-forwarded-for'] || req.ip);
morgan.token('responseTime', (req, res) => `${res.getHeader('X-Response-Time')}ms`);

// Morgan middleware configuration with custom log format
const morganMiddleware = morgan(
    (tokens, req, res) => {
        return [
            `[${tokens.date(req, res, 'clf')}]`,
            `${tokens.client(req, res)}`,
            `${tokens.method(req, res)}`,
            `${tokens.url(req, res)}`,
            `${tokens.status(req, res)}`,
            `${tokens['response-time'](req, res)}ms`,
            `"${tokens['user-agent'](req, res)}"`
        ].join(' | ');
    },
    {
        stream: {
            write: (message) => logger.info(message.trim()), // Send Morgan logs to Winston
        },
    }
);

export { logger, morganMiddleware };
