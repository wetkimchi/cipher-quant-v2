import { MoniCuratedTokensChannel } from "../channels/moni-curated-tokens";
import { MoniRawTokensChannel } from "../channels/moni-raw-tokens";
import { MoniXSmartAlphaChannel } from "../channels/moni-x-smart-alpha";
import { RodFusWalletsChannel } from "../channels/rod-fus-wallets";
import { SolMicrocapAlertsChannel } from "../channels/sol-microcap-alerts";
import { TopDegenWalletsChannel } from "../channels/top-degen-wallets";
import { getBuyersForToken } from "../utils/nansen";

const ALERT_CHANNEL_ID = "1325616722706829312";
const PREV_DISPLAY_NAME = "2x_Social_SM_Wallet_Bot";
const DISPLAY_NAME = "High_Conviction";

function areConditionsValidForAlert(address: string, details: AddressDetails) {
  const lastAlertTime =
    details.strategiesLastAlertTime?.[DISPLAY_NAME] ??
    details.strategiesLastAlertTime?.[PREV_DISPLAY_NAME];

  // if we have alerted in the last 6 hours, we don't want to alert again
  if (lastAlertTime && Date.now() - lastAlertTime < 60 * 60 * 6 * 1000)
    return false;

  const moniXSmartCount = details.mentions.filter(
    (mention) => mention.channelId === MoniXSmartAlphaChannel.channelId
  ).length;

  const moniRawCount = details.mentions.filter(
    (mention) => mention.channelId === MoniRawTokensChannel.channelId
  ).length;

  const moniCuratedCount = details.mentions.filter(
    (mention) => mention.channelId === MoniCuratedTokensChannel.channelId
  ).length;

  const solMicrocapCount = details.mentions.filter(
    (mention) => mention.channelId === SolMicrocapAlertsChannel.channelId
  ).length;

  const topDegenWalletsMentions = details.mentions.filter(
    (mention) => mention.channelId === TopDegenWalletsChannel.channelId
  );
  const topDegenWalletsCount = getBuyersForToken(
    address,
    topDegenWalletsMentions
  ).length;

  const rodFusWalletsMentions = details.mentions.filter(
    (mention) => mention.channelId === RodFusWalletsChannel.channelId
  );
  const rodFusWalletsCount = getBuyersForToken(
    address,
    rodFusWalletsMentions
  ).length;

  const degenBuys = topDegenWalletsCount + rodFusWalletsCount;

  // 2 follow + 2 buys
  if (moniXSmartCount >= 1 && degenBuys >= 2) return true;

  // 1 follow + 1 raw + 2 buys
  if (moniXSmartCount >= 1 && moniRawCount >= 1 && degenBuys >= 2) return true;

  // 1 follow + 1 curated + 2 buys
  if (moniXSmartCount >= 1 && moniCuratedCount >= 1 && degenBuys >= 2)
    return true;

  // 2 follow + 1 microcap + 2 buys
  if (moniXSmartCount >= 1 && solMicrocapCount >= 1 && degenBuys >= 2)
    return true;

  return false;
}

function filterMentions(mentions: Mention[]) {
  return mentions.filter(
    (mention) =>
      mention.channelId === MoniXSmartAlphaChannel.channelId ||
      mention.channelId === MoniRawTokensChannel.channelId ||
      mention.channelId === MoniCuratedTokensChannel.channelId ||
      mention.channelId === SolMicrocapAlertsChannel.channelId ||
      mention.channelId === TopDegenWalletsChannel.channelId ||
      mention.channelId === RodFusWalletsChannel.channelId
  );
}

function getMessage(address: string, details: AddressDetails) {
  return address;
}

export const HighConviction: Strategy = {
  displayName: DISPLAY_NAME,
  alertChannelId: ALERT_CHANNEL_ID,
  areConditionsValidForAlert,
  filterMentions,
  getMessage,
};
