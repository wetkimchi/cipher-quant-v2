import { Message } from "discord.js";
import { getAllAddresses } from "../../regex";

export function extractAddresses(message: Message): string[] {
  const contentAddresses = getAllAddresses(message.content);
  const embedsJson = message.embeds.map((embed) => embed.toJSON());
  const embeds = JSON.stringify(embedsJson);
  const embedsAddresses = getAllAddresses(embeds);
  return [...contentAddresses, ...embedsAddresses];
}
