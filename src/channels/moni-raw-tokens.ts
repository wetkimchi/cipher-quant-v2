import { Message } from "discord.js";
import { getAllAddresses, isSolanaAddress } from "../regex";
import { RawTokenInfo } from "./common/nansen";

const channelId = "1308956239333560341";
const displayName = "MONI_RAW_TOKENS";

function extractAddresses(message: Message): RawTokenInfo[] {
  const embed = message.embeds[0];
  const fields = JSON.stringify(embed.fields);
  const description = embed.description ?? "";
  const addresses = [...getAllAddresses(description), ...getAllAddresses(fields)];
  return addresses.map((address) => {
    return { CA: address, type: "buy", chain: isSolanaAddress(address) ? "solana" : "UNKNOWN" };
  });
}

export const MoniRawTokensChannel = {
  channelId,
  displayName,
  extractAddresses,
};
