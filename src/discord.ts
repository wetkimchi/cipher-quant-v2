import {
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  TextChannel,
} from "discord.js";

import { DailyPNL } from "./strategies/daily-pnl";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);

client.once("ready", () => {
  logger.info(`Logged in as ${client.user?.tag}`);
});

client.on("error", (error) => {
  logger.error("Discord client error:", error);
});

async function sendMessage(
  targetChannelId: string,
  address: string,
  embed: EmbedBuilder
) {
  try {
    const targetChannel = await client.channels.fetch(targetChannelId);
    if (targetChannel instanceof TextChannel) {
      const messageOptions = targetChannelId === DailyPNL.alertChannelId
      ? { content: `${address}` } // No embed for daily PNL channel
      : { content: `${address}`, embeds: [embed] }; 
      await targetChannel.send(messageOptions);
    }
  } catch (error) {
    logger.error("Error sending message:", error);
    logger.error("Retrying in 5 seconds...");
    setTimeout(sendMessage, 5000, targetChannelId, address, embed);
  }
}

export { client, sendMessage };
