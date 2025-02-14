import { RodFusWalletsChannel } from "../channels/rod-fus-wallets";


// channel id is the same for test and prod
const ALERT_CHANNEL_ID = "1316963536676851772";
const ALERT_TEST_CHANNEL_ID = "1316963536676851772";
const PREV_DISPLAY_NAME = "Ca_Alert_Bot";
const DISPLAY_NAME = "Early_Alpha";

function areConditionsValidForAlert(address: string, details: AddressDetails) {
  const lastAlertTime =
    details.strategiesLastAlertTime?.[DISPLAY_NAME] ??
    details.strategiesLastAlertTime?.[PREV_DISPLAY_NAME];

  // last alert time should be more than 1 hour ago
  if (lastAlertTime && Date.now() - lastAlertTime < 60 * 60 * 2 * 1000)
    return false;

  const mentions = details.mentions.filter(
    (mention) => mention.channelId !== RodFusWalletsChannel.channelId
  );

  if (mentions.length >= 2) {
    logger.debug(`Alerting for ${address}`);
    return true;
  }

  logger.debug(`Not alerting for ${address}`);
  return false;
}

function filterMentions(mentions: Mention[]) {
  return mentions.filter(
    (mention) => mention.channelId !== RodFusWalletsChannel.channelId
  );
}

function getMessage(address: string, details: AddressDetails) {
  const alertCount = details.strategyAlertCount?.[DISPLAY_NAME] ?? 0;
  if (alertCount == 0) {
    return `🌱 ${details.info?.symbol}`;
  } else if (alertCount > 0) {
    return `🔁(${alertCount}) ${details.info?.symbol}`;
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

export const EarlyAlpha: Strategy = {
  displayName: DISPLAY_NAME,
  alertChannelId: ALERT_CHANNEL_ID,
  alertTestChannelId: ALERT_TEST_CHANNEL_ID,
  areConditionsValidForAlert,
  filterMentions,
  getMessage,
  getAlertChannelId,
};
