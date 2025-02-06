import { RodFusWalletsChannel } from "../channels/rod-fus-wallets";


// channel id is the same for test and prod
const ALERT_CHANNEL_ID = "1335689060236263435";
const ALERT_TEST_CHANNEL_ID = "1335689060236263435";
const DISPLAY_NAME = "rickbot-pnl";

function areConditionsValidForAlert(address: string, details: AddressDetails) {
    const alertCount = details.strategyAlertCount?.[DISPLAY_NAME] ?? 0;
    
    // Only alert for first buy
    // return alertCount === 0;
    return true;
}

function filterMentions(mentions: Mention[]) {
  return mentions.filter(
    (mention) =>
      mention.channelId === RodFusWalletsChannel.channelId
  );
}

function getMessage(address: string, details: AddressDetails) {
    return "@rick " + address;
}

function getAlertChannelId() {
  const isTestMode = process.env.TEST_MODE === "true";
  if (isTestMode) {
    logger.info(`Test mode. Using ${ALERT_TEST_CHANNEL_ID} for ${DISPLAY_NAME}`);
    return ALERT_TEST_CHANNEL_ID;
  }
  return ALERT_CHANNEL_ID;
}

export const DailyPNL: Strategy = {
  displayName: DISPLAY_NAME,
  alertChannelId: ALERT_CHANNEL_ID,
  alertTestChannelId: ALERT_TEST_CHANNEL_ID,
  areConditionsValidForAlert,
  filterMentions,
  getMessage,
  getAlertChannelId,
};