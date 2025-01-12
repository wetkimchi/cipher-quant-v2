import { RodFusWalletsChannel } from "../channels/rod-fus-wallets";
import { getBuyersForToken } from "../utils/nansen";

const ALERT_CHANNEL_ID = "1320089662617948250";
const DISPLAY_NAME = "High_Conviction_Alerts";

function areConditionsValidForAlert(address: string, details: AddressDetails) {
  const lastAlertTime = details.strategiesLastAlertTime?.[DISPLAY_NAME];

  if (lastAlertTime && Date.now() - lastAlertTime < 60 * 60 * 24 * 1000)
    return false;

  const rodFusMentions = details.mentions.filter(
    (mention) => mention.channelId === RodFusWalletsChannel.channelId
  );

  const walletAddresses = getBuyersForToken(address, rodFusMentions);

  return walletAddresses.length >= 6;
}

function filterMentions(mentions: Mention[]) {
  return mentions.filter(
    (mention) => mention.channelId === RodFusWalletsChannel.channelId
  );
}

export const HighConvictionAlerts: Strategy = {
  displayName: DISPLAY_NAME,
  alertChannelId: ALERT_CHANNEL_ID,
  areConditionsValidForAlert,
  filterMentions,
};
