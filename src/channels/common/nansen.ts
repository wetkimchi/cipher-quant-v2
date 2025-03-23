import { Message } from "discord.js";

// Create struct for token info with default values
export interface RawTokenInfo {
  CA: string;
  type: "buy" | "sell";
  chain: "base" | "solana" | "avalanche" | "ethereum" | "UNKNOWN";
}
/**
 * Given a nansen url messages this function` will extract all the token addresses and token addresses only
 */
export function extractAddresses(message: Message): RawTokenInfo[] {
  const embed = message.embeds[0];
  const description = embed.description;
  if (!description) return [];
  const addresses = [];

  // Regex explanation:
  // ([\s\S]*?)    -> lazily capture any text (the transaction block) before the delimiter
  // :scroll:\s*CA:\s*  -> match the literal delimiter text (with optional whitespace)
  // `             -> match a backtick
  // (0x[a-fA-F0-9]{40}|[1-9A-HJ-NP-Za-km-z]{32,44})
  //               -> capture either an Ethereum address (0x followed by 40 hex digits)
  //                  or a Solana address (32 to 44 characters in the given base58 alphabet)
  // `             -> match the closing backtick
  const regex = /([\s\S]*?):scroll:\s*CA:\s*`(0x[a-fA-F0-9]{40}|[1-9A-HJ-NP-Za-km-z]{32,44})`/gi;
  const tokenInfos = [];
  let match;
  
  // Use the regex to iterate over all transaction blocks.
  while ((match = regex.exec(description)) !== null) {
    const transactionText = match[1];
    const CA = match[2];

    // Determine the type: if "sell" appears anywhere in the transaction text (case-insensitive), type is "sell", else "buy".
    const type = /sell/i.test(transactionText) ? "sell" : "buy";

    // Try to extract the chain from the transaction text.
    const chainMatch = transactionText.match(/:chains:\s*Chain:\s*#(\w+)/i);
    const rawChain = chainMatch ? chainMatch[1].toLowerCase() : "UNKNOWN";
    
    // Validate chain type
    const chain = (["base", "solana", "avalanche", "ethereum", "UNKNOWN"].includes(rawChain) 
      ? rawChain 
      : "UNKNOWN") as RawTokenInfo["chain"];
      
    addresses.push(CA);
    const tokenInfo: RawTokenInfo = { CA, type, chain };
    tokenInfos.push(tokenInfo);
  }
  logger.info(`Extracted ${tokenInfos.length} token infos:`);
  for (const tokenInfo of tokenInfos) {
    logger.info(`CA: ${tokenInfo.CA}, type: ${tokenInfo.type}, chain: ${tokenInfo.chain}`);
  }
  return tokenInfos;
}


export function extractBuySizes(message: Message): number[] {
  const embed = message.embeds[0];
  const description = embed.description;
  if (!description) return [];

  // Match dollar amounts in parentheses, like ($2,536.37)
  const buyMatches = description.match(/\(\$[^)]*\)/g) || [];
  const buyPrices = buyMatches.map(match => {
    // match will be something like "($504.26 @ 0/THELION)"
    // capture only the numeric portion after the '$'
    const numberMatch = match.match(/\$([\d,]+\.?\d*)/);
    return numberMatch ? parseFloat(numberMatch[1].replace(/,/g, '')) : 0;
  });

  logger.info(`Extracted buy prices: ${buyPrices.join(', ')}`);
  return buyPrices;
}
