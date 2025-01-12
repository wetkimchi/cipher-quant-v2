import { Message } from "discord.js";
import { extractAddresses } from "../channels/common/nansen";

const testDescription =
  "[🌱 BEN](https://app.nansen.ai/token-god-mode?tokenAddress=EuQNq6DeRfFRHCiwLJTsF89g9BVJmSxChbu4fdhHpump&chain=solana&utm_source=smart_alert&utm_medium=discord&utm_campaign=619c5a80-10f8-40cc-83ae-7c5f71b5dbc4): $2,384.99 (1H)\n[🌱 TRENCHES](https://app.nansen.ai/token-god-mode?tokenAddress=1h8Ft5jbTXBjijisLbg3jzdf6pBQ12nHDouMf8kpump&chain=solana&utm_source=smart_alert&utm_medium=discord&utm_campaign=619c5a80-10f8-40cc-83ae-7c5f71b5dbc4): $9,520.97 (1H)\n[KEKE](https://app.nansen.ai/token-god-mode?tokenAddress=Gp8GVGPc8QCe4Jn6ryG5YKokG5bjKycATEzqpeyspump&chain=solana&utm_source=smart_alert&utm_medium=discord&utm_campaign=619c5a80-10f8-40cc-83ae-7c5f71b5dbc4): $11,919.5 (1H)\n[🌱 FW](https://app.nansen.ai/token-god-mode?tokenAddress=D45qbGyNUzR9fAMfbTx4gfavCaDbfrnoX9w63idsDzoo&chain=solana&utm_source=smart_alert&utm_medium=discord&utm_campaign=619c5a80-10f8-40cc-83ae-7c5f71b5dbc4): $2,525.9 (1H)\n[🌱 MOONDOG](https://app.nansen.ai/token-god-mode?tokenAddress=7gMxpJ5GULbmpqafk86KiRAaUumZHNSBV8VGnFJp6h3G&chain=solana&utm_source=smart_alert&utm_medium=discord&utm_campaign=619c5a80-10f8-40cc-83ae-7c5f71b5dbc4): $7,066.46 (1H)\nExplore the [Smart Money Token Flows](https://app.nansen.ai/smart-money?tab=wallets&utm_source=smart_alert&utm_medium=discord&utm_campaign=619c5a80-10f8-40cc-83ae-7c5f71b5dbc4) dashboard.\n\nChain: Solana";

const testDescription2 =
  "[🏦 Raydium: Authority V4](https://app.nansen.ai/profiler?address=5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1&chain=solana&tab=transactions&utm_source=smart_alert&utm_medium=discord&utm_campaign=2d274045-133f-4964-a1b6-d9cf2a9c56b5) sent 2,966,106.15 [U](https://app.nansen.ai/token-god-mode?tokenAddress=3UmhxsHvh35zeDtKazW4w8UCcBYq3qXuFDkcbxNQpump&chain=solana&utm_source=smart_alert&utm_medium=discord&utm_campaign=2d274045-133f-4964-a1b6-d9cf2a9c56b5) ($395.13) to [🤓 Gaming Token Expert](https://app.nansen.ai/profiler?chain=solana&address=CgsM7KA8A5cuQ62zmWbCvnJLdXmS3P1rTZteho2i2PA8&tab=transactions&utm_source=smart_alert&utm_medium=discord&utm_campaign=2d274045-133f-4964-a1b6-d9cf2a9c56b5)\n[View Tx](https://solscan.io/tx/3si18dkuDvo3rA71QbNF4Lz2XArTeHcbNRxSo9ZRVAFXCNMBYDWW1oYMB49eAFk2tBGWgvTwp3Suz3TvVkT8auqy)\n\n[🏦 Raydium: Authority V4](https://app.nansen.ai/profiler?address=5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1&chain=solana&tab=transactions&utm_source=smart_alert&utm_medium=discord&utm_campaign=2d274045-133f-4964-a1b6-d9cf2a9c56b5) sent 4,493,392.14 [🌱 PSPT](https://app.nansen.ai/token-god-mode?tokenAddress=NHYzz3XNA4QJHwo8e25jG3Zz9xvLqPh1VMCfTH5uhat&chain=solana&utm_source=smart_alert&utm_medium=discord&utm_campaign=2d274045-133f-4964-a1b6-d9cf2a9c56b5) ($1,625.43) to [🤓 Smart Trader](https://app.nansen.ai/profiler?chain=solana&address=En9k2qRCb9qwrWxE1rqrGYVC5qJfDdGs4H2nyaAZhbdL&tab=transactions&utm_source=smart_alert&utm_medium=discord&utm_campaign=2d274045-133f-4964-a1b6-d9cf2a9c56b5)\n[View Tx](https://solscan.io/tx/28tyfJ1wHLKDT1kE7UmPYc7Rs4MyvfyyesS3gPXztXA9PZERM7hm9o2tU3y9js4PPhypr67LPazZj8vzUv4vkx3r)\n\n[🏦 Raydium: Authority V4](https://app.nansen.ai/profiler?address=5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1&chain=solana&tab=transactions&utm_source=smart_alert&utm_medium=discord&utm_campaign=2d274045-133f-4964-a1b6-d9cf2a9c56b5) sent 4,263,645.34 [U](https://app.nansen.ai/token-god-mode?tokenAddress=3UmhxsHvh35zeDtKazW4w8UCcBYq3qXuFDkcbxNQpump&chain=solana&utm_source=smart_alert&utm_medium=discord&utm_campaign=2d274045-133f-4964-a1b6-d9cf2a9c56b5) ($567.98) to [🤓 Gaming Token Expert](https://app.nansen.ai/profiler?chain=solana&address=CgsM7KA8A5cuQ62zmWbCvnJLdXmS3P1rTZteho2i2PA8&tab=transactions&utm_source=smart_alert&utm_medium=discord&utm_campaign=2d274045-133f-4964-a1b6-d9cf2a9c56b5)\n[View Tx](https://solscan.io/tx/2fGJHoywg4s5KWoBBkWeipKHYNE25v5tBwoZY4uJLEHEEyLZyJ3RVYJ7DixmNMXE6fq7WCCdaoGgkH7t7m1t4WFg)\n\n[🏦 Raydium: Authority V4](https://app.nansen.ai/profiler?address=5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1&chain=solana&tab=transactions&utm_source=smart_alert&utm_medium=discord&utm_campaign=2d274045-133f-4964-a1b6-d9cf2a9c56b5) sent 391,503.52 [🌱 SEEKER](https://app.nansen.ai/token-god-mode?tokenAddress=HP4cZoMLxgp5gY2H6nQ2hnaS2kzU9nzugVRaw4k7pump&chain=solana&utm_source=smart_alert&utm_medium=discord&utm_campaign=2d274045-133f-4964-a1b6-d9cf2a9c56b5) ($807.07) to [🤓 Top 100 on ARC Leaderboard](https://app.nansen.ai/profiler?chain=solana&address=5c28TuB7k2bYThkwxfBYLpiXuvcZeQLq9gPNirXpX6gR&tab=transactions&utm_source=smart_alert&utm_medium=discord&utm_campaign=2d274045-133f-4964-a1b6-d9cf2a9c56b5)\n[View Tx](https://solscan.io/tx/3nAubsR1aHXyVN5YfozLZAy15FKn7MvSvj6wfJimqDSnMA1CzPmq4fkgWETeMQqVsMrYHF8ANCBKFKFRLti3uKsC)\n\nChain: Solana";

const message = {
  embeds: [
    {
      description: testDescription,
    },
  ],
} as unknown as Message;

describe("extractAddresses", () => {
  const solanaDescription =
    "[🌱 BEN](https://app.nansen.ai/token-god-mode?tokenAddress=EuQNq6DeRfFRHCiwLJTsF89g9BVJmSxChbu4fdhHpump&chain=solana&utm_source=smart_alert&utm_medium=discord&utm_campaign=619c5a80-10f8-40cc-83ae-7c5f71b5dbc4): $2,384.99 (1H)\n[🌱 TRENCHES](https://app.nansen.ai/token-god-mode?tokenAddress=1h8Ft5jbTXBjijisLbg3jzdf6pBQ12nHDouMf8kpump&chain=solana&utm_source=smart_alert&utm_medium=discord&utm_campaign=619c5a80-10f8-40cc-83ae-7c5f71b5dbc4): $9,520.97 (1H)\n[KEKE](https://app.nansen.ai/token-god-mode?tokenAddress=Gp8GVGPc8QCe4Jn6ryG5YKokG5bjKycATEzqpeyspump&chain=solana&utm_source=smart_alert&utm_medium=discord&utm_campaign=619c5a80-10f8-40cc-83ae-7c5f71b5dbc4): $11,919.5 (1H)\n[🌱 FW](https://app.nansen.ai/token-god-mode?tokenAddress=D45qbGyNUzR9fAMfbTx4gfavCaDbfrnoX9w63idsDzoo&chain=solana&utm_source=smart_alert&utm_medium=discord&utm_campaign=619c5a80-10f8-40cc-83ae-7c5f71b5dbc4): $2,525.9 (1H)\n[🌱 MOONDOG](https://app.nansen.ai/token-god-mode?tokenAddress=7gMxpJ5GULbmpqafk86KiRAaUumZHNSBV8VGnFJp6h3G&chain=solana&utm_source=smart_alert&utm_medium=discord&utm_campaign=619c5a80-10f8-40cc-83ae-7c5f71b5dbc4): $7,066.46 (1H)\nExplore the [Smart Money Token Flows](https://app.nansen.ai/smart-money?tab=wallets&utm_source=smart_alert&utm_medium=discord&utm_campaign=619c5a80-10f8-40cc-83ae-7c5f71b5dbc4) dashboard.\n\nChain: Solana";
  const baseDescription =
    "[SIMMI](https://app.nansen.ai/token-god-mode?tokenAddress=0x161e113b8e9bbaefb846f73f31624f6f9607bd44&utm_source=smart_alert&utm_medium=discord&utm_campaign=d41ed689-04f2-4145-b3f0-0c1301204c06): $8,942.48 (1H)\n[🌱 BLAP](https://app.nansen.ai/token-god-mode?tokenAddress=0x140284d383918c522aca8f1cc6df49043b562e9b&utm_source=smart_alert&utm_medium=discord&utm_campaign=d41ed689-04f2-4145-b3f0-0c1301204c06): $2,413.5 (1H)\nExplore the [Smart Money Token Flows](https://app.nansen.ai/smart-money?tab=wallets&utm_source=smart_alert&utm_medium=discord&utm_campaign=d41ed689-04f2-4145-b3f0-0c1301204c06) dashboard.\n\nChain: Base";

  it("should extract Ethereum and Solana addresses from the message description", () => {
    const message = {
      embeds: [
        {
          description: solanaDescription + baseDescription,
        },
      ],
    } as unknown as Message;

    const result = extractAddresses(message);

    expect(result).toEqual([
      "0x161e113b8e9bbaefb846f73f31624f6f9607bd44",
      "0x140284d383918c522aca8f1cc6df49043b562e9b",
      "EuQNq6DeRfFRHCiwLJTsF89g9BVJmSxChbu4fdhHpump",
      "1h8Ft5jbTXBjijisLbg3jzdf6pBQ12nHDouMf8kpump",
      "Gp8GVGPc8QCe4Jn6ryG5YKokG5bjKycATEzqpeyspump",
      "D45qbGyNUzR9fAMfbTx4gfavCaDbfrnoX9w63idsDzoo",
      "7gMxpJ5GULbmpqafk86KiRAaUumZHNSBV8VGnFJp6h3G",
    ]);
  });

  it("should return an empty array if no addresses are found", () => {
    const message = {
      embeds: [
        {
          description: "Nothing to see here",
        },
      ],
    } as unknown as Message;

    const result = extractAddresses(message);

    expect(result).toEqual([]);
  });

  it("should filter out Solana addresses that are part of any Ethereum address", () => {
    const message = {
      embeds: [
        {
          description: baseDescription,
        },
      ],
    } as unknown as Message;

    const result = extractAddresses(message);

    expect(result).toEqual([
      "0x161e113b8e9bbaefb846f73f31624f6f9607bd44",
      "0x140284d383918c522aca8f1cc6df49043b562e9b",
    ]);
  });

  it("check it is extracting only token address and all the token addresses", () => {
    const message = {
      embeds: [
        {
          description: testDescription2,
        },
      ],
    } as unknown as Message;

    const result = extractAddresses(message);

    expect(result).toEqual([
      "3UmhxsHvh35zeDtKazW4w8UCcBYq3qXuFDkcbxNQpump",
      "NHYzz3XNA4QJHwo8e25jG3Zz9xvLqPh1VMCfTH5uhat",
      "3UmhxsHvh35zeDtKazW4w8UCcBYq3qXuFDkcbxNQpump",
      "HP4cZoMLxgp5gY2H6nQ2hnaS2kzU9nzugVRaw4k7pump",
    ]);
  });
});
