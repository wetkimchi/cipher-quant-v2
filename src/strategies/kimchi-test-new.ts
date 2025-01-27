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
    logger.info("Alerting for kimchi test");
    return true;
}

function filterMentions(mentions: Mention[]) {
  return mentions.filter(
    (mention) =>
      mention.channelId === RodFusWalletsChannel.channelId
  );
}

function getMessage(address: string, details: AddressDetails) {
    const rodFusWalletsMentions = details.mentions.filter(
        (mention) => mention.channelId === RodFusWalletsChannel.channelId
    );

        // check if address has been mentioned in the last 24 hours
    const rufusMentionsInLast24Hours = rodFusWalletsMentions.filter(
        (mention) => Date.now() - mention.timestamp < 60 * 60 * 24 * 1000
    );

    if (rufusMentionsInLast24Hours.length === 1) {
        return "🌱 (since 24hrs ago)";
    } else if (rufusMentionsInLast24Hours.length > 1) {
      return "🔁" + "  (" + (rufusMentionsInLast24Hours.length) + ")";
    }

    logger.error(`Unexpected mention sum: rufus=${rufusMentionsInLast24Hours.length}`);
    return "❓";
}

export const KimchiTestNew: Strategy = {
  displayName: DISPLAY_NAME,
  alertChannelId: ALERT_CHANNEL_ID,
  areConditionsValidForAlert,
  filterMentions,
  getMessage,
};