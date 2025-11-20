import { Message } from "discord.js";
import { MoniXSmartAlphaChannel } from "./moni-x-smart-alpha";
import { TopDegenWalletsChannel } from "./top-degen-wallets";
import { RodFusWalletsChannel } from "./rod-fus-wallets";
import { MoniCuratedTokensChannel } from "./moni-curated-tokens";
import { MoniRawTokensChannel } from "./moni-raw-tokens";
import { SolMicrocapAlertsChannel } from "./sol-microcap-alerts";
import { AltfinsAnalyticsChannel } from "./altfins-analytics";
import { RawTokenInfo } from "./common/nansen";

export type Channel = {
  channelId: string;
  displayName: string;
  extractAddresses: (message: Message) => RawTokenInfo[];
  extractBuySizes?: (message: Message) => number[];
  getDetails?: (mention: Mention) => string[];
};

export const rawChannels: Record<string, Channel> = {
  [SolMicrocapAlertsChannel.channelId]: SolMicrocapAlertsChannel,
  [TopDegenWalletsChannel.channelId]: TopDegenWalletsChannel,
  [RodFusWalletsChannel.channelId]: RodFusWalletsChannel,
  [MoniCuratedTokensChannel.channelId]: MoniCuratedTokensChannel,
  [MoniRawTokensChannel.channelId]: MoniRawTokensChannel,
  [MoniXSmartAlphaChannel.channelId]: MoniXSmartAlphaChannel,
  [AltfinsAnalyticsChannel.channelId]: AltfinsAnalyticsChannel,
};

export const channelIds = Object.keys(rawChannels);
