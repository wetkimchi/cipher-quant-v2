import { MoniCuratedTokensChannel } from "../channels/moni-curated-tokens";
import { MoniRawTokensChannel } from "../channels/moni-raw-tokens";
import { MoniXSmartAlphaChannel } from "../channels/moni-x-smart-alpha";
import { RodFusWalletsChannel } from "../channels/rod-fus-wallets";
import { SolMicrocapAlertsChannel } from "../channels/sol-microcap-alerts";
import { TopDegenWalletsChannel } from "../channels/top-degen-wallets";
import { getBuyersForToken } from "../utils/nansen";


// channel id is the same for test and prod
const ALERT_CHANNEL_ID = "1332027281471963197";
const ALERT_TEST_CHANNEL_ID = "1332027281471963197";
const DISPLAY_NAME = "Kimchi_Test";

function areConditionsValidForAlert(address: string, details: AddressDetails) {
  const mentionCount = details.mentions.filter(
    (mention) => mention.channelId == RodFusWalletsChannel.channelId
  ).length;

  const isAlert = mentionCount%2 === 1 || mentionCount === 2;

  return isAlert;
}

function filterMentions(mentions: Mention[]) {
  return mentions.filter(
    (mention) =>
      mention.channelId === RodFusWalletsChannel.channelId
  );
}


function getMessage(address: string, details: AddressDetails) {
  const alertCount = details.strategyAlertCount?.[DISPLAY_NAME] ?? 0;
  if (alertCount == 0) {
    return `🌱 ${details.info?.symbol}`;
  } else if (alertCount > 0) {
    return `🔁 (${alertCount}) ${details.info?.symbol}`;
  }
  logger.error(`Unexpected alert count: alertCount=${alertCount}`);
  return "❓";
}

function getAlertChannelId() {
  const isTestMode = process.env.TEST_MODE === "true";
  if (isTestMode) {
    logger.info(`Test mode. Using ${ALERT_TEST_CHANNEL_ID} for ${DISPLAY_NAME}`);
    return ALERT_TEST_CHANNEL_ID;
  }
  return ALERT_CHANNEL_ID;
}

function getPurchaseSizeSymbol(purchaseSize: number) {
  // if (purchaseSize < 1000) return "🪱";
  // if (purchaseSize < 60000) return "🐛";
  // if (purchaseSize < 150000) return "🦋";
  // return "🌏";
  return "";
}

export const KimchiTestNew: Strategy = {
  displayName: DISPLAY_NAME,
  alertChannelId: ALERT_CHANNEL_ID,
  alertTestChannelId: ALERT_TEST_CHANNEL_ID,
  areConditionsValidForAlert,
  filterMentions,
  getMessage,
  getAlertChannelId,
};