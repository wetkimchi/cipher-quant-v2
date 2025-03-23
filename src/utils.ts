import { fetchTokenInfo } from "./api";
import { RawTokenInfo } from "./channels/common/nansen";
import { isSolanaAddress } from "./regex";

export function getMessageLink(mention: Mention): string {
  return `https://discord.com/channels/${mention.guildId}/${mention.channelId}/${mention.messageId}`;
}

export function timeAgo(timestamp: number) {
  return `<t:${Math.floor(timestamp / 1000)}:R>`;
}

export async function getAddressInfo(
  rawTokenInfo: RawTokenInfo,
  details: AddressDetails | undefined
) {
  if (details?.info) {
    return details.info;
  }

  const info = await fetchTokenInfo(
    isSolanaAddress(rawTokenInfo.CA) ? "solana" : rawTokenInfo.chain,
    rawTokenInfo.CA
  );
  return info;
}
