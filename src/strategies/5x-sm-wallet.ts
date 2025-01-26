import { RodFusWalletsChannel } from "../channels/rod-fus-wallets";
import { getBuyersForToken } from "../utils/nansen";

const ALERT_CHANNEL_ID = "1320089662617948250";
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
  return address;
}

export const FiveXSmWallet: Strategy = {
  displayName: DISPLAY_NAME,
  alertChannelId: ALERT_CHANNEL_ID,
  areConditionsValidForAlert,
  filterMentions,
  getMessage,
};
