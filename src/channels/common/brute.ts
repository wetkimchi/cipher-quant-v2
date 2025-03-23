import { Message } from "discord.js";
import { getAllAddresses } from "../../regex";
import { RawTokenInfo } from "./nansen";

export function extractAddresses(message: Message): RawTokenInfo[] {
  const contentAddresses = getAllAddresses(message.content);
  const embedsJson = message.embeds.map((embed) => embed.toJSON());
  const embeds = JSON.stringify(embedsJson);
  const embedsAddresses = getAllAddresses(embeds);
  const addresses = [...contentAddresses, ...embedsAddresses];
  return addresses.map((address) => {
    return { CA: address, type: "buy", chain: "UNKNOWN" };
  });
}
