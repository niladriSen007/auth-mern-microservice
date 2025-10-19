import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { serverConfig } from './index.js';

// Helper functions for colored logging
export const loggers = {
    info: (message: string) => logger.info(message),
    success: (message: string) => logger.info(message),
    warning: (message: string) => logger.warn(message),
    error: (message: string) => logger.error(message),
    debug: (message: string) => logger.debug(message),
};

export const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'MM-DD-YYYY HH:mm:ss' }),
        winston.format.printf(({ level, message, timestamp, ...data }) => {
            const output = {
                level,
                message,
                timestamp,
                /* correlationId: getCorrelationId(),  */
                data,
            };
            return JSON.stringify(output);
        })
    ),
    transports: [
        new winston.transports.Console({
            level: serverConfig?.LOGGER_LEVEL || 'info',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({ format: 'MM-DD-YYYY HH:mm:ss' }),
                winston.format.printf(({ level, message, timestamp }) => {
                    // Preserve chalk colors in console output
                    return `${timestamp} [${level}]: ${message}`;
                })
            ),
            silent: serverConfig?.NODE_ENV === 'test', // Disable console logging in test environment
        }),
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'MM-DD-YYYY HH:mm:ss' }),
                winston.format.json()
            ),
            silent: serverConfig?.NODE_ENV === 'test', // Disable file logging in test environment
        }),
        new DailyRotateFile({
            level: serverConfig?.LOGGER_LEVEL || 'info',
            filename: 'logs/%DATE%-app.log', // The file name pattern
            datePattern: 'YYYY-MM-DD', // The date format
            maxSize: '20m', // The maximum size of the log file
            maxFiles: '14d', // The maximum number of log files to keep
            format: winston.format.combine(
                winston.format.timestamp({ format: 'MM-DD-YYYY HH:mm:ss' }),
                winston.format.json() // Keep JSON format for file logs
            ),
            silent: serverConfig?.NODE_ENV === 'test', // Disable file logging in test environment
        }),
        // TODO: add logic to integrate and save logs in mongo
    ],
});
