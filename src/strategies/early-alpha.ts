import { RodFusWalletsChannel } from "../channels/rod-fus-wallets";

const ALERT_CHANNEL_ID = "1316963536676851772";
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
  return address;
}

export const EarlyAlpha: Strategy = {
  displayName: DISPLAY_NAME,
  alertChannelId: ALERT_CHANNEL_ID,
  areConditionsValidForAlert,
  filterMentions,
  getMessage,
};
