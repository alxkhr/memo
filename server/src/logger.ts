import { RequestHandler } from 'express';
import winston from 'winston';
import winstonDailyRotateFile from 'winston-daily-rotate-file';
import chalk from 'chalk';

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  const formattedLevel = level.toUpperCase().padStart(5, ' ');
  return `${timestamp} ${formattedLevel}: ${message}`;
});

const customColorizedFormat = winston.format.printf(
  ({ level, message, timestamp }) => {
    const chalkedLevel = chalk.white(level.toUpperCase().padStart(5, ' '));
    switch (level) {
      case 'debug':
        return `${chalk.grey(timestamp)} ${chalkedLevel}: ${chalk.rgb(
          255,
          0,
          255,
        )(message)}`;
      case 'info':
        return `${chalk.grey(timestamp)} ${chalkedLevel}: ${message}`;
      case 'warn':
        return `${chalk.grey(timestamp)} ${chalkedLevel}: ${chalk.yellow(
          message,
        )}`;
      case 'error':
        return `${chalk.grey(timestamp)} ${chalkedLevel}: ${chalk.red(
          message,
        )}`;
      default:
        return `${chalk.grey(timestamp)} ${chalkedLevel}: ${chalk.blue(
          message,
        )}`;
    }
  },
);

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), customFormat),
  transports: [
    new winstonDailyRotateFile({
      filename: 'logs/%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        customColorizedFormat,
      ),
      level: process.env.MODE === 'development' ? 'debug' : 'warn',
    }),
  ],
});

export const logRequest: RequestHandler = (req, res, next) => {
  // TODO find the real ip and user id of the requester if exists (maybe only log on warn/error)
  const reqMessage = `${req.method}:${req.headers.host || 'unknown_host'}${
    req.url
  } by ${req.ip}`;
  logger.debug(`Request incoming: ${reqMessage}`);
  res.on('close', () => {
    // detect when the connection is closed unexpectedly
    if (res.writableFinished) {
      logger.info(
        `Request finished: ${reqMessage} >>> ${res.statusCode} ${res.statusMessage}`,
      );
    } else {
      logger.warn(
        `Request closed: ${reqMessage} >>> ${res.statusCode} ${res.statusMessage}`,
      );
    }
  });
  next();
};
