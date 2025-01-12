import {
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  TextChannel,
} from "discord.js";

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
  const targetChannel = await client.channels.fetch(targetChannelId);
  if (targetChannel instanceof TextChannel) {
    await targetChannel.send({
      content: `${address}`,
      embeds: [embed],
    });
  }
}

export { client, sendMessage };
