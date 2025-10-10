import { fetchTokenInfoWithRetry } from "./api";
import { RawTokenInfo } from "./channels/common/nansen";

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

  const info = await fetchTokenInfoWithRetry(rawTokenInfo.CA);
  return info;
}
