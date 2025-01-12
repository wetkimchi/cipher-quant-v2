import { Message } from "discord.js";
import { getAllAddresses } from "../regex";

const channelId = "1308956239333560341";
const displayName = "MONI_RAW_TOKENS";

function extractAddresses(message: Message): string[] {
  const embed = message.embeds[0];
  const fields = JSON.stringify(embed.fields);
  const description = embed.description ?? "";

  return [...getAllAddresses(description), ...getAllAddresses(fields)];
}

export const MoniRawTokensChannel = {
  channelId,
  displayName,
  extractAddresses,
};
