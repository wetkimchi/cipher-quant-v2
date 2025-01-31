import { RodFusWalletsChannel } from "../channels/rod-fus-wallets";
import { getBuyersForToken } from "../utils/nansen";

const ALERT_CHANNEL_ID = "1320089662617948250";
const ALERT_TEST_CHANNEL_ID = "1333948301682409673";
const PREV_DISPLAY_NAME = "High_Conviction_Alerts";
const DISPLAY_NAME = "5x_SM_Wallet";

function areConditionsValidForAlert(address: string, details: AddressDetails) {
  const lastAlertTime =
    details.strategiesLastAlertTime?.[DISPLAY_NAME] ??
    details.strategiesLastAlertTime?.[PREV_DISPLAY_NAME];

  if (lastAlertTime && Date.now() - lastAlertTime < 60 * 60 * 24 * 1000)
    return false;

  const rodFusMentions = details.mentions.filter(
    (mention) => mention.channelId === RodFusWalletsChannel.channelId
  );

  const walletAddresses = getBuyersForToken(address, rodFusMentions);

  return walletAddresses.length >= 5;
}

function filterMentions(mentions: Mention[]) {
  return mentions.filter(
    (mention) => mention.channelId === RodFusWalletsChannel.channelId
  );
}

function getMessage(address: string, details: AddressDetails) {
  const alertCount = details.strategyAlertCount?.[DISPLAY_NAME] ?? 0;
  if (alertCount == 0) {
    return `🌱 ${details.info?.symbol}`;
  } else if (alertCount > 0) {
    return `🔁 ${details.info?.symbol} (${alertCount})`;
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

export const FiveXSmWallet: Strategy = {
  displayName: DISPLAY_NAME,
  alertChannelId: ALERT_CHANNEL_ID,
  alertTestChannelId: ALERT_TEST_CHANNEL_ID,
  areConditionsValidForAlert,
  filterMentions,
  getMessage,
  getAlertChannelId,
};
