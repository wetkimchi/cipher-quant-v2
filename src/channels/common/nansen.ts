import { Message } from "discord.js";

/**
 * Given a nansen url messages this function` will extract all the token addresses and token addresses only
 */
export function extractAddresses(messsage: Message): string[] {
  const embed = messsage.embeds[0];
  const description = embed.description;
  if (!description) return [];

  const solanaTokenAddressMatches =
    description.match(/tokenAddress=([1-9A-HJ-NP-Za-km-z]{32,44})/g) || [];
  const solanaAddresses = solanaTokenAddressMatches.map(
    (match) => match.split("=")[1]
  );

  const ethTokenAddressMatches =
    description.match(/tokenAddress=(0x[a-fA-F0-9]{40})/g) || [];
  const ethAddresses = ethTokenAddressMatches.map(
    (match) => match.split("=")[1]
  );

  // Filter out Solana addresses that are part of any Ethereum address
  const filteredSolanaAddresses = solanaAddresses.filter(
    (solanaAddress) =>
      !ethAddresses.some((ethAddress) => ethAddress.includes(solanaAddress))
  );

  return [...ethAddresses, ...filteredSolanaAddresses];
}

export function extractBuySizes(message: Message): number[] {
  const embed = message.embeds[0];
  const description = embed.description;
  if (!description) return [];

  // Match dollar amounts in parentheses, like ($2,536.37)
  const buyMatches = description.match(/\(\$[\d,]+\.?\d*\)/g) || [];
  const buyPrices = buyMatches.map(match => 
    parseFloat(match.replace(/[\$\(\),]/g, ''))
  );

  logger.info(`Extracted buy prices: ${buyPrices.join(', ')}`);
  return buyPrices;
}
