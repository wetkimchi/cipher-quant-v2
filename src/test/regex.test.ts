import { getAllAddresses } from "../regex";
import { isSolanaAddress } from "../regex";
import { isEthAddress } from "../regex";

describe("getAllAddresses", () => {
  it("should return only Ethereum addresses when Solana address is part of Ethereum address", () => {
    const content =
      "0x1234567890abcdef1234567890abcdef12345678 1234567890abcdef1234567890abcdef12345678";
    const result = getAllAddresses(content);
    expect(result).toEqual(["0x1234567890abcdef1234567890abcdef12345678"]);
  });

  it("should return both Ethereum and Solana addresses when they are distinct", () => {
    const content =
      "0x1234567890abcdef1234567890abcdef12345678 Gp8GVGPc8QCe4Jn6ryG5YKokG5bjKycATEzqpeyspump";
    const result = getAllAddresses(content);
    expect(result).toEqual([
      "0x1234567890abcdef1234567890abcdef12345678",
      "Gp8GVGPc8QCe4Jn6ryG5YKokG5bjKycATEzqpeyspump",
    ]);
  });

  it("should return only Solana addresses when no Ethereum address is present", () => {
    const content = "Gp8GVGPc8QCe4Jn6ryG5YKokG5bjKycATEzqpeyspump";
    const result = getAllAddresses(content);
    expect(result).toEqual(["Gp8GVGPc8QCe4Jn6ryG5YKokG5bjKycATEzqpeyspump"]);
  });

  it("should return an empty array when no addresses are present", () => {
    const content = "No addresses here!";
    const result = getAllAddresses(content);
    expect(result).toEqual([]);
  });
});

describe("isSolanaAddress", () => {
  it("should return true for a valid Solana address", () => {
    const validAddress = "AsyfR3e5JcPqWot4H5MMhQUm7DZ4zwQrcp2zbB7vpump";
    expect(isSolanaAddress(validAddress)).toBe(true);
  });

  it("should return false for an invalid Solana address", () => {
    const invalidAddress = "1234567890abcdef1234567890abcdef12345678";
    expect(isSolanaAddress(invalidAddress)).toBe(false);
  });

  it("should return false for an empty string", () => {
    expect(isSolanaAddress("")).toBe(false);
  });

  it("should return false for a string with special characters", () => {
    const specialCharAddress = "AsyfR3e5JcPqWot4H5MMhQUm7DZ4zwQrcp2zbB7v!@#$";
    console.log(isSolanaAddress(specialCharAddress));
    expect(isSolanaAddress(specialCharAddress)).toBe(false);
  });

  it("should return false for a string that is too short", () => {
    const shortAddress = "AsyfR3e5JcPqWot4H5MMhQUm7DZ4z";
    expect(isSolanaAddress(shortAddress)).toBe(false);
  });

  it("should return false for a string that is too long", () => {
    const longAddress = "AsyfR3e5JcPqWot4H5MMhQUm7DZ4zwQrcp2zbB7vpump12345";
    expect(isSolanaAddress(longAddress)).toBe(false);
  });

  it("should return false for a eth wallet", () => {
    const longAddress = "0x800822d361335b4d5f352dac293ca4128b5b605f";
    expect(isSolanaAddress(longAddress)).toBe(false);
  });
});

describe("isEthAddress", () => {
  it("should return true for a valid Ethereum address", () => {
    const validEthAddress = "0x1234567890abcdef1234567890abcdef12345678";
    expect(isEthAddress(validEthAddress)).toBe(true);
  });

  it("should return false for an Ethereum address with invalid characters", () => {
    const invalidEthAddress = "0x1234567890abcdef1234567890abcdef1234567g";
    expect(isEthAddress(invalidEthAddress)).toBe(false);
  });

  it("should return false for an Ethereum address that is too short", () => {
    const shortEthAddress = "0x1234567890abcdef1234567890abcdef123456";
    expect(isEthAddress(shortEthAddress)).toBe(false);
  });

  it("should return false for an Ethereum address that is too long", () => {
    const longEthAddress = "0x1234567890abcdef1234567890abcdef1234567890";
    expect(isEthAddress(longEthAddress)).toBe(false);
  });

  it("should return false for an empty string", () => {
    expect(isEthAddress("")).toBe(false);
  });
});
