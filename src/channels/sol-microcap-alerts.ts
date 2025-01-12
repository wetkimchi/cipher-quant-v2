import { extractAddresses } from "./common/nansen";

// "description": "[🌱 BEN](https://app.nansen.ai/token-god-mode?tokenAddress=EuQNq6DeRfFRHCiwLJTsF89g9BVJmSxChbu4fdhHpump&chain=solana&utm_source=smart_alert&utm_medium=discord&utm_campaign=619c5a80-10f8-40cc-83ae-7c5f71b5dbc4): $2,384.99 (1H)\n[🌱 TRENCHES](https://app.nansen.ai/token-god-mode?tokenAddress=1h8Ft5jbTXBjijisLbg3jzdf6pBQ12nHDouMf8kpump&chain=solana&utm_source=smart_alert&utm_medium=discord&utm_campaign=619c5a80-10f8-40cc-83ae-7c5f71b5dbc4): $9,520.97 (1H)\n[KEKE](https://app.nansen.ai/token-god-mode?tokenAddress=Gp8GVGPc8QCe4Jn6ryG5YKokG5bjKycATEzqpeyspump&chain=solana&utm_source=smart_alert&utm_medium=discord&utm_campaign=619c5a80-10f8-40cc-83ae-7c5f71b5dbc4): $11,919.5 (1H)\n[🌱 FW](https://app.nansen.ai/token-god-mode?tokenAddress=D45qbGyNUzR9fAMfbTx4gfavCaDbfrnoX9w63idsDzoo&chain=solana&utm_source=smart_alert&utm_medium=discord&utm_campaign=619c5a80-10f8-40cc-83ae-7c5f71b5dbc4): $2,525.9 (1H)\n[🌱 MOONDOG](https://app.nansen.ai/token-god-mode?tokenAddress=7gMxpJ5GULbmpqafk86KiRAaUumZHNSBV8VGnFJp6h3G&chain=solana&utm_source=smart_alert&utm_medium=discord&utm_campaign=619c5a80-10f8-40cc-83ae-7c5f71b5dbc4): $7,066.46 (1H)\nExplore the [Smart Money Token Flows](https://app.nansen.ai/smart-money?tab=wallets&utm_source=smart_alert&utm_medium=discord&utm_campaign=619c5a80-10f8-40cc-83ae-7c5f71b5dbc4) dashboard.\n\nChain: Solana",

const channelId = "1301582566175932426";
const displayName = "SOL_MICROCAP_ALERTS";

export const SolMicrocapAlertsChannel = {
  channelId,
  displayName,
  extractAddresses,
};
