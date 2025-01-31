import { MoniXSmartAlphaChannel } from "../channels/moni-x-smart-alpha";

// channel id is the same for test and prod
const ALERT_CHANNEL_ID = "1323921538331836446";
const ALERT_TEST_CHANNEL_ID = "1323921538331836446";
const DISPLAY_NAME = "Smart_Followers";

function areConditionsValidForAlert(_: string, details: AddressDetails) {
  const moniXMentions = details.mentions.filter(
    (mention) =>
      mention.channelId === MoniXSmartAlphaChannel.channelId &&
      Date.now() - mention.timestamp <= 60 * 60 * 1000
  );

  return moniXMentions.length >= 3;
}

function filterMentions(mentions: Mention[]) {
  return mentions.filter(
    (mention) => mention.channelId === MoniXSmartAlphaChannel.channelId
  );
}

function getMessage(address: string, details: AddressDetails) {
  return address;
}

function getAlertChannelId() {
  const isTestMode = process.env.TEST_MODE === "true";
  if (isTestMode) {
    logger.info(`Test mode. Using ${ALERT_TEST_CHANNEL_ID} for ${DISPLAY_NAME}`);
    return ALERT_TEST_CHANNEL_ID;
  }
  return ALERT_CHANNEL_ID;
}

export const SmartFollowers: Strategy = {
  displayName: DISPLAY_NAME,
  alertChannelId: ALERT_CHANNEL_ID,
  alertTestChannelId: ALERT_TEST_CHANNEL_ID,
  areConditionsValidForAlert,
  filterMentions,
  getMessage,
  getAlertChannelId,
};
