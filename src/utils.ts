import { fetchTokenInfo } from "./api";
import { isSolanaAddress } from "./regex";

export function getMessageLink(mention: Mention): string {
  return `https://discord.com/channels/${mention.guildId}/${mention.channelId}/${mention.messageId}`;
}

export function timeAgo(timestamp: number) {
  return `<t:${Math.floor(timestamp / 1000)}:R>`;
}

export async function getAddressInfo(
  address: string,
  details: AddressDetails | undefined
) {
  if (details?.info) return details.info;

  const info = await fetchTokenInfo(
    isSolanaAddress(address) ? "solana" : "base",
    address
  );

  return info;
}
