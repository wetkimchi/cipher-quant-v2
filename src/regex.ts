// Regex pattern for Solana addresses (base58 encoded, 32-44 characters)
export const solanaAddressPattern = /[1-9A-HJ-NP-Za-km-z]{32,44}/g;
export const ethAddressPattern = /0x[a-fA-F0-9]{40}/g;

export function isSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/g.test(address);
}

export function isEthAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/g.test(address);
}

export function getAllAddresses(content: string): string[] {
  const ethAddresses = content.match(ethAddressPattern) || [];
  const solanaAddresses = content.match(solanaAddressPattern) || [];

  // Filter out Solana addresses that are part of any Ethereum address
  const filteredSolanaAddresses = solanaAddresses.filter(
    (solanaAddress) =>
      !ethAddresses.some((ethAddress) => ethAddress.includes(solanaAddress))
  );

  return [...ethAddresses, ...filteredSolanaAddresses];
}