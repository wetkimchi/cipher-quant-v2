import "./setup";
import { Message } from "discord.js";
import { mainStore, Store } from "./store";
import { client, sendMessage } from "./discord";
import { getAddressInfo, getMessageLink } from "./utils";
import { channelIds, channels } from "./channels";
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

  const strategies = [HighConviction];
  if (message.channel.id === RodFusWalletsChannel.channelId) {
    strategies.push(FiveXSmWallet);
    strategies.push(KimchiTestNew);
  } else {
    strategies.push(EarlyAlpha);

    if (message.channel.id === MoniXSmartAlphaChannel.channelId) {
      strategies.push(SmartFollowers);
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
  const _addresses = channels[message.channel.id].extractAddresses(message);
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

  for (const address of uniqueAddresses) {
    const prevMatch = store.get(address);
    const addressDetails: AddressDetails = {
      lastTouched: Date.now(),
      info: await getAddressInfo(address, prevMatch),
      mentions: [latestMention, ...(prevMatch?.mentions || [])],
      lastPrice: await fetchPrice("solana", address),
      strategiesLastAlertTime: prevMatch?.strategiesLastAlertTime || {},
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
    sendMessage(strategy.alertChannelId, message, embed);
    return true;
  }
  return false;
}
