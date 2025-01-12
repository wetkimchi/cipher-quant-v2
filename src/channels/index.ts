import { Message } from "discord.js";
import { MoniXSmartAlphaChannel } from "./moni-x-smart-alpha";
import { TopDegenWalletsChannel } from "./top-degen-wallets";
import { RodFusWalletsChannel } from "./rod-fus-wallets";
import { MoniCuratedTokensChannel } from "./moni-curated-tokens";
import { MoniRawTokensChannel } from "./moni-raw-tokens";
import { SolMicrocapAlertsChannel } from "./sol-microcap-alerts";

export type Channel = {
  channelId: string;
  displayName: string;
  extractAddresses: (message: Message) => string[];
  getDetails?: (mention: Mention) => string[];
};

export const channels: Record<string, Channel> = {
  [SolMicrocapAlertsChannel.channelId]: SolMicrocapAlertsChannel,
  [TopDegenWalletsChannel.channelId]: TopDegenWalletsChannel,
  [RodFusWalletsChannel.channelId]: RodFusWalletsChannel,
  [MoniCuratedTokensChannel.channelId]: MoniCuratedTokensChannel,
  [MoniRawTokensChannel.channelId]: MoniRawTokensChannel,
  [MoniXSmartAlphaChannel.channelId]: MoniXSmartAlphaChannel,
};

export const channelIds = Object.keys(channels);
