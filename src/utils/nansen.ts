export function getBuyersForToken(
  address: string,
  mentions: Mention[]
): string[] {
  const buyers: string[] = [];

  for (const mention of mentions) {
    const embed = mention.embeds[0];

    const description = embed.description;
    if (!description) return [];

    const descriptions = description.split("\n\n");
    descriptions.forEach((desc: string) => {
      if (!desc.includes(address)) return;

      const solanaWalletAddressMatches =
        desc.match(/address=([1-9A-HJ-NP-Za-km-z]{32,44})/g) || [];
      const solanaAddresses = solanaWalletAddressMatches.map(
        (match: string) => match.split("=")[1]
      );

      const ethWalletAddressMatches =
        desc.match(/address=(0x[a-fA-F0-9]{40})/g) || [];
      const ethAddresses = ethWalletAddressMatches.map(
        (match: string) => match.split("=")[1]
      );

      const addresses = solanaAddresses.filter(
        (solanaAddress: string) =>
          // Check that the Solana address isn't part of any ETH address
          !ethAddresses.some((ethAddress: string) =>
            ethAddress.includes(solanaAddress)
          ) &&
          // Exclude specific addresses
          solanaAddress !== "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1" &&
          solanaAddress !== "GGztQqQ6pCPaJQnNpXBgELr5cs3WwDakRbh1iEMzjgSJ"
      );

      buyers.push(...addresses, ...ethAddresses);
    });
  }

  return [...new Set(buyers)];
}
