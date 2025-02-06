import "./setup";
import { Embed, Message } from "discord.js";
import { mainStore, Store } from "./store";
import { client, sendMessage } from "./discord";
import { getAddressInfo, getMessageLink } from "./utils";
import { channelIds, rawChannels } from "./channels";
import { RodFusWalletsChannel } from "./channels/rod-fus-wallets";
import { MoniXSmartAlphaChannel } from "./channels/moni-x-smart-alpha";
import { getMention } from "./message/get-mention";
import { getEmbed } from "./message/embed/get-embed";
import { fetchPrice } from "./api";
import {
  HighConviction,
  EarlyAlpha,
  FiveXSmWallet,
  SmartFollowers,
  KimchiTestNew,
  DailyPNL,
} from "./strategies";

// Add immediate console logs for debugging
console.log('Starting application...');

client.on("messageCreate", async (message: Message) => {
  // Ignore messages from this bot
  if (message.author.id === client.user?.id || !message.guild?.id) return;

  logger.info(
    `Message received ${message.id} at channel ${message.channel.id}`
  );

  if (!channelIds.includes(message.channel.id)) {
    logger.info(`Unknown channel ${message.channel.id}`);
    return;
  }

  // const strategies = [HighConviction];
  const strategies = [DailyPNL];
  if (message.channel.id === RodFusWalletsChannel.channelId) {
    // strategies.push(FiveXSmWallet);
    // strategies.push(KimchiTestNew);
  } else {
    // strategies.push(EarlyAlpha);

    if (message.channel.id === MoniXSmartAlphaChannel.channelId) {
      // strategies.push(SmartFollowers);
    }
  }
  try {
    await onMessage(message, mainStore, strategies);
  } catch (e) {
    logger.error(e);
  }
});

async function onMessage(
  message: Message,
  store: Store,
  strategies: Strategy[]
) {
  const latestMention = getMention(message);
  const _addresses = rawChannels[message.channel.id].extractAddresses(message);
  const purchaseSizes = rawChannels[message.channel.id].extractBuySizes?.(message) ?? [];
  const uniqueAddresses = [...new Set(_addresses)];
  logger.info(
    `Found ${uniqueAddresses.length} addresses in message ${getMessageLink(
      latestMention
    )}`
  );

  if (uniqueAddresses.length === 0) return;

  logger.info(
    `${message.id} 🔓 LOCKING: to process message ++++++++++++++++++++++++++++++++++++++++++++++++++++++`
  );
  await store.acquireLock();

  for (let i = 0; i < uniqueAddresses.length; i++) {
    const address = uniqueAddresses[i];
    const prevMatch = store.get(address);
    const addressDetails: AddressDetails = {
      purchaseSize: purchaseSizes[i] || null,
      lastTouched: Date.now(),
      info: await getAddressInfo(address, prevMatch),
      mentions: [latestMention, ...(prevMatch?.mentions || [])],
      lastPrice: await fetchPrice("solana", address),
      strategiesLastAlertTime: prevMatch?.strategiesLastAlertTime || {},
      strategyAlertCount: prevMatch?.strategyAlertCount || {},
    };

    for (const strategy of strategies) {
      if (runStrategy(address, strategy, addressDetails)) {
        logger.info(
          `${message.id}: 🔒 LOCKED: ${address}: ${strategy.displayName}: ✅ ALERTED`
        );
        addressDetails.strategiesLastAlertTime = {
          ...addressDetails.strategiesLastAlertTime,
          [strategy.displayName]: Date.now(),
        };
        // Reset count to 1 if last alert was more than 24 hours ago
        const lastAlertTime = addressDetails.strategiesLastAlertTime[strategy.displayName] || 0;
        const hoursSinceLastAlert = (Date.now() - lastAlertTime) / (1000 * 60 * 60);
        
        addressDetails.strategyAlertCount = {
          ...addressDetails.strategyAlertCount || {},
          [strategy.displayName]: hoursSinceLastAlert > 24 ? 1 : (addressDetails.strategyAlertCount?.[strategy.displayName] || 0) + 1
        };
      } else {
        logger.info(
          `${message.id} 🔒 LOCKED: ${address}: ${strategy.displayName}: ❌ NOT_ALERTED`
        );
      }
    }

    store.set(address, addressDetails);
  }

  store.releaseLock();
  logger.info(
    `${message.id} 🔓 UNLOCKED: message processed -----------------------------------------------------`
  );
}

// Return true if the strategy alerted, false otherwise
function runStrategy(
  address: string,
  strategy: Strategy,
  addressDetails: AddressDetails
): boolean {
  if (strategy.areConditionsValidForAlert(address, addressDetails)) {
    const embed = getEmbed(address, addressDetails, strategy.filterMentions);
    const message:string = strategy.getMessage(address, addressDetails);
    sendMessage(strategy.getAlertChannelId(), message, embed);
    return true;
  }
  return false;
}
