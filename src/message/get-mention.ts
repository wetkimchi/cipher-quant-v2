import { Message } from "discord.js";

export function getMention(message: Message): Mention {
  return {
    timestamp: message.createdTimestamp,
    guildId: message.guild!.id,
    channelId: message.channel.id,
    messageId: message.id,
    content: message.content,
    embeds: message.embeds.map((embed) => embed.toJSON()),
  };
}
