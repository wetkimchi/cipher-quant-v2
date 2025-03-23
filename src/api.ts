const baseApi = "https://api.geckoterminal.com/api/v2";

interface TokenInfoResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      address: string;
      name: string;
      symbol: string;
      decimals: number;
      image_url: string;
      coingecko_coin_id: string;
      websites: string[];
      description: string;
      gt_score: number;
      discord_url: string | null;
      telegram_handle: string | null;
      twitter_handle: string | null;
    };
  };
}

interface PriceResponse {
  data: {
    attributes: {
      price_usd: string;
      fdv_usd: string;
    };
  };
}

export async function fetchTokenInfo(
  network: "base" | "solana" | "avalanche" | "ethereum" | "UNKNOWN",
  address: string
): Promise<TokenInfo | null> {
  if (network === "UNKNOWN") {
    logger.info(`Unknown network for ${address}`);
    return null;
  }
  try {
    const res = await fetch(
      `${baseApi}/networks/${getNetwork(network)}/tokens/${address}/info`
    );
    if (!res.ok) return null;

    const data: TokenInfoResponse = await res.json();

    if (!data.data.attributes) return null;

    return {
      name: data.data.attributes.name,
      symbol: data.data.attributes.symbol,
      imageUrl:
        data.data.attributes.image_url === "missing.png"
          ? null
          : data.data.attributes.image_url,
      twitterHandle: data.data.attributes.twitter_handle,
      telegramHandle: data.data.attributes.telegram_handle,
      discordUrl: data.data.attributes.discord_url,
      description: data.data.attributes.description,
      websites: data.data.attributes.websites,
    };
  } catch (error) {
    logger.error(`Error fetching token info for ${address}: ${error}`);
    return null;
  }
}

export async function fetchPrice(
  network: "base" | "solana" | "avalanche" | "ethereum" | "UNKNOWN",
  address: string
): Promise<{ price: string; fdv: string } | null> {
  try {
    const res = await fetch(
      `${baseApi}/networks/${getNetwork(network)}/tokens/${address}`,
      {
        headers: { accept: "application/json" },
      }
    );

    if (!res.ok) return null;

    const data: PriceResponse = await res.json();

    return {
      price: data.data.attributes.price_usd,
      fdv: data.data.attributes.fdv_usd,
    };
  } catch (error) {
    logger.error(`Error fetching price for ${address} on ${network}: ${error}`);
    return null;
  }
}

function getNetwork(network: "base" | "solana" | "avalanche" | "ethereum" | "UNKNOWN"): string {
  if (network === "avalanche") return "avax";
  if (network === "ethereum") return "eth";
  return network;
}
