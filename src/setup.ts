// GLOGAL LOGGER
import pino from "pino";
import * as fs from 'fs';

declare global {
  var logger: pino.Logger;
}

// Ensure logs directory exists
if (!fs.existsSync('./logs')) {
  console.log('Creating logs directory...');
  fs.mkdirSync('./logs');
}

global.logger = pino({
  level: "debug",
  transport: {
    targets: [
      {
        target: "pino-pretty",
        options: { colorize: true },
      },
      {
        target: "pino/file",
        options: { destination: "./logs/app.log" },
      },
    ],
  },
});

// DOTENV
import dotenv from "dotenv";
dotenv.config();
if (!process.env.DISCORD_TOKEN) {
  logger.error("DISCORD_TOKEN is not set");
  process.exit(1);
}

// Validate Altfins credentials
if (!process.env.ALTFINS_EMAIL || !process.env.ALTFINS_PASSWORD) {
  logger.error("ALTFINS_EMAIL or ALTFINS_PASSWORD is not set");
  process.exit(1);
}
