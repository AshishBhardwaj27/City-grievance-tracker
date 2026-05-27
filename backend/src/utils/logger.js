import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logDir = path.join(__dirname, "../../logs");

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const devFmt = printf(({ level, message, timestamp: ts, stack }) =>
  `${ts} [${level}]: ${stack || message}`
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), errors({ stack: true })),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, "error.log"), level: "error", format: json() }),
    new winston.transports.File({ filename: path.join(logDir, "combined.log"), format: json() }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console({ format: combine(colorize(), devFmt) }));
}

export {logger}
