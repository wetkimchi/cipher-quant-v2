import { MoniCuratedTokensChannel } from "../channels/moni-curated-tokens";
import { MoniRawTokensChannel } from "../channels/moni-raw-tokens";
import { MoniXSmartAlphaChannel } from "../channels/moni-x-smart-alpha";
import { RodFusWalletsChannel } from "../channels/rod-fus-wallets";
import { SolMicrocapAlertsChannel } from "../channels/sol-microcap-alerts";
import { TopDegenWalletsChannel } from "../channels/top-degen-wallets";
import { getBuyersForToken } from "../utils/nansen";

const ALERT_CHANNEL_ID = "1332027281471963197";
const DISPLAY_NAME = "Kimchi_Test";

function areConditionsValidForAlert(address: string, details: AddressDetails) {
    const lastAlertTime = details.strategiesLastAlertTime?.[DISPLAY_NAME];

    // if we have alerted in the last 24 hours, we don't want to alert again
    if (lastAlertTime && Date.now() - lastAlertTime < 60 * 60 * 24 * 1000)
    return false;
    return true;
}

function filterMentions(mentions: Mention[]) {
  return mentions.filter(
    (mention) =>
      mention.channelId === RodFusWalletsChannel.channelId ||
      mention.channelId === TopDegenWalletsChannel.channelId
  );
}

function getMessage(address: string, details: AddressDetails) {
  const rodFusWalletsMentions = details.mentions.filter(
    (mention) => mention.channelId === RodFusWalletsChannel.channelId
    );

    const topDegenWalletsMentions = details.mentions.filter(
    (mention) => mention.channelId === TopDegenWalletsChannel.channelId
    );

    // check if address has been mentioned in the last 24 hours
    const rufusMentionsInLast24Hours = rodFusWalletsMentions.filter(
    (mention) => Date.now() - mention.timestamp < 60 * 60 * 24 * 1000
    ).length;

    const topDegenMentionsInLast24Hours = topDegenWalletsMentions.filter(
    (mention) => Date.now() - mention.timestamp < 60 * 60 * 24 * 1000
    ).length;
    if (rufusMentionsInLast24Hours + topDegenMentionsInLast24Hours === 0) {
        return "🌱";
    } else if (rufusMentionsInLast24Hours + topDegenMentionsInLast24Hours > 1) {
      return "🔁" + " (" + rufusMentionsInLast24Hours+ topDegenMentionsInLast24Hours + ")";
    }
    logger.error("Unexpected mention sum");
    return ""
}

export const KimchiTestNew: Strategy = {
  displayName: DISPLAY_NAME,
  alertChannelId: ALERT_CHANNEL_ID,
  areConditionsValidForAlert,
  filterMentions,
  getMessage,
};