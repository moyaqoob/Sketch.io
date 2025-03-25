import fs from "fs";
import path from "path";
import chalk from "chalk";

const logFilePath = path.join(__dirname, "../../logs/app.log");

function writeToFile(level: string, message: string, args: any[]) {
  const logMessage = `[${new Date().toISOString()}] [${level}] ${message} ${args.length ? JSON.stringify(args) : ""}\n`;

  // Ensure logs directory exists
  if (!fs.existsSync(path.dirname(logFilePath))) {
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
  }

  // Append to log file
  fs.appendFileSync(logFilePath, logMessage);
}

export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(chalk.blue("[INFO]"), message, ...args);
    writeToFile("INFO", message, args);
  },

  warn: (message: string, ...args: any[]) => {
    console.warn(chalk.yellow("[WARN]"), message, ...args);
    writeToFile("WARN", message, args);
  },

  error: (message: string, ...args: any[]) => {
    console.error(chalk.red("[ERROR]"), message, ...args);
    writeToFile("ERROR", message, args);
  },

  debug: (message: string, ...args: any[]) => {
    if (process.env.DEBUG === "true") {
      console.log(chalk.magenta("[DEBUG]"), message, ...args);
      writeToFile("DEBUG", message, args);
    }
  },
};
