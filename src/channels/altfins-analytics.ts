import { Message } from "discord.js";
import { RawTokenInfo } from "./common/nansen";

const channelId = "1440851805499031662";
const displayName = "ALTFINS_ANALYTICS";

/**
 * Dummy implementation to satisfy Channel interface
 * Always returns empty array since we don't extract addresses
 */
function extractAddresses(message: Message): RawTokenInfo[] {
  return [];
}

/**
 * Parse Altfins analysis command from message
 * Format: analysis BTC or analysis BTC,ETH,SOL
 */
function parseCommand(message: Message): AltfinsCommand | null {
  const content = message.content.trim();

  // Check if starts with 'analysis' (case-insensitive)
  if (!content.toLowerCase().startsWith('analysis')) {
    return null;
  }

  // Split by whitespace
  const parts = content.split(/\s+/);

  // Remove 'analysis' keyword
  parts.shift();

  if (parts.length === 0) {
    // Just "analysis" with no symbol - invalid
    return null;
  }

  // First part is the symbol(s)
  const symbol = parts[0];

  return {
    type: 'analysis',
    params: {
      symbol,
    },
  };
}

export const AltfinsAnalyticsChannel = {
  channelId,
  displayName,
  extractAddresses,
  parseCommand,
};

