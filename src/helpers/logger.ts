import { NextFunction, Request, Response } from 'express';
import winston from 'winston';
const { timestamp, combine, errors, json, simple, splat } = winston.format;

export const logger = winston.createLogger({
  level: 'info',
  handleExceptions: true,
  exitOnError: false,
  format: combine(
    timestamp(),
    errors({stack: true}),
    splat(),
    json(),
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format:combine( 
        simple(),
        ),
    }));
}

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) =>{
    logger.info(req.url)
    next()
}

export default loggerMiddleware
