import { MoniXSmartAlphaChannel } from "../channels/moni-x-smart-alpha";

const ALERT_CHANNEL_ID = "1323921538331836446";
const DISPLAY_NAME = "Smart_Followers";

function areConditionsValidForAlert(_: string, details: AddressDetails) {
  const lastAlertTime =
    details.strategiesLastAlertTime?.[DISPLAY_NAME];

  // last alert time should be more than 15 minutes ago
  if (lastAlertTime && Date.now() - lastAlertTime < 60 * 15 * 1000)
    return false;

  const moniXMentions = details.mentions.filter(
    (mention) => mention.channelId === MoniXSmartAlphaChannel.channelId
  );

  return moniXMentions.length >= 2;
}

function filterMentions(mentions: Mention[]) {
  return mentions.filter(
    (mention) => mention.channelId === MoniXSmartAlphaChannel.channelId
  );
}

export const SmartFollowers: Strategy = {
  displayName: DISPLAY_NAME,
  alertChannelId: ALERT_CHANNEL_ID,
  areConditionsValidForAlert,
  filterMentions,
};
