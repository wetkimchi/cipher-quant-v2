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
 * Parse Altfins command from message
 * Format: analysis SYMBOL [page] [size] [sort]
 *         analytics SYMBOL [timeInterval] [analyticsType] [from] [to]
 *         list
 *
 * Examples:
 *   analysis BTC
 *   analysis BTC 0 50 symbol,ASC
 *   analytics BTC
 *   analytics BTC HOURLY RSI14
 *   analytics BTC DAILY SMA10 2025-11-01T00:00:00Z 2025-11-21T00:00:00Z
 *   list
 */
function parseCommand(message: Message): AltfinsCommand | null {
  const content = message.content.trim();
  const contentLower = content.toLowerCase();

  // Check for 'list' command first (no parameters needed)
  if (contentLower === 'list') {
    return {
      type: 'list',
      params: {},
    };
  }

  let commandType: 'analysis' | 'analytics' | null = null;

  // Support common typos
  if (contentLower.startsWith('analysis ') || contentLower.startsWith('analyse ')) {
    commandType = 'analysis';
  } else if (contentLower.startsWith('analytics ') || contentLower.startsWith('analytic ') || contentLower.startsWith('anlaytics ')) {
    commandType = 'analytics';
  } else {
    return null;
  }

  // Split by whitespace
  const parts = content.split(/\s+/);

  // Remove command keyword
  parts.shift();

  if (parts.length === 0) {
    // No symbol provided - invalid
    return null;
  }

  if (commandType === 'analysis') {
    const params: AltfinsAnalysisParams = {
      symbol: parts[0],
    };

    // Positional parameters: [page] [size] [sort]
    if (parts.length > 1 && !parts[1].includes('=')) {
      params.page = parseInt(parts[1], 10);
    }
    if (parts.length > 2 && !parts[2].includes('=')) {
      params.size = parseInt(parts[2], 10);
    }
    if (parts.length > 3 && !parts[3].includes('=')) {
      params.sort = parts[3];
    }

    // Also support key=value format
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      if (part.includes('=')) {
        const [key, value] = part.split('=');

        if (key === 'page') {
          params.page = parseInt(value, 10);
        } else if (key === 'size') {
          params.size = parseInt(value, 10);
        } else if (key === 'sort') {
          params.sort = value;
        }
      }
    }

    return {
      type: 'analysis',
      params,
    };
  } else {
    // analytics command
    const params: AltfinsAnalyticsParams = {
      symbol: parts[0],
    };

    // Positional parameters: [timeInterval] [analyticsType] [from] [to]
    if (parts.length > 1 && !parts[1].includes('=')) {
      params.timeInterval = parts[1];
    }
    if (parts.length > 2 && !parts[2].includes('=')) {
      params.analyticsType = parts[2];
    }
    if (parts.length > 3 && !parts[3].includes('=')) {
      params.from = parts[3];
    }
    if (parts.length > 4 && !parts[4].includes('=')) {
      params.to = parts[4];
    }

    // Also support key=value format
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      if (part.includes('=')) {
        const [key, value] = part.split('=');

        if (key === 'timeInterval') {
          params.timeInterval = value;
        } else if (key === 'analyticsType') {
          params.analyticsType = value;
        } else if (key === 'from') {
          params.from = value;
        } else if (key === 'to') {
          params.to = value;
        }
      }
    }

    return {
      type: 'analytics',
      params,
    };
  }
}

export const AltfinsAnalyticsChannel = {
  channelId,
  displayName,
  extractAddresses,
  parseCommand,
};

