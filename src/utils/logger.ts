/**
 * Define a custom Logger using winston
 */

import * as winston from "winston";
import { CONFIG } from "../config";

export const logger = winston.createLogger({
  level: CONFIG.WINSTON_LOG_LEVEL,
  transports: [new winston.transports.Console()]
});

export const disableConsoleLog = (): void => {
  logger.remove(winston.transports.Console);
};
