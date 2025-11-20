import "./setup";
import { Message } from "discord.js";
import { mainStore, Store } from "./store";
import { client, sendMessage } from "./discord";
import { getAddressInfo, getMessageLink } from "./utils";
import { channelIds, rawChannels } from "./channels";
import { RodFusWalletsChannel } from "./channels/rod-fus-wallets";
import { MoniXSmartAlphaChannel } from "./channels/moni-x-smart-alpha";
import { AltfinsAnalyticsChannel } from "./channels/altfins-analytics";
import { getMention } from "./message/get-mention";
import { getEmbed } from "./message/embed/get-embed";
import { fetchPriceWithRetry } from "./api";
import { fetchAltfinsAnalysis } from "./api/altfins";
import { createAltfinsAnalysisEmbed } from "./message/embed/altfins-embed";
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

  // Early return for Altfins channel
  if (message.channel.id === AltfinsAnalyticsChannel.channelId) {
    try {
      await handleAltfinsMessage(message);
    } catch (e) {
      logger.error(`Error handling Altfins message: ${e}`);
    }
    return; // Don't process further
  }

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
  const tokenInfos = rawChannels[message.channel.id].extractAddresses(message);
  // iterate through tokeInfos and aggregate unique entries
  const uniqueTokenInfos = [...new Set(tokenInfos)];
  const purchaseSizes = rawChannels[message.channel.id].extractBuySizes?.(message) ?? [];
  logger.info(
    `Found ${uniqueTokenInfos.length} addresses in message ${getMessageLink(
      latestMention
    )}`
  );

  if (uniqueTokenInfos.length === 0) return;

  logger.info(
    `${message.id} 🔓 LOCKING: to process message ++++++++++++++++++++++++++++++++++++++++++++++++++++++`
  );
  await store.acquireLock();

  for (let i = 0; i < uniqueTokenInfos.length; i++) {
    const tokenInfo = uniqueTokenInfos[i];
    const address = tokenInfo.CA;
    const prevMatch = store.get(address);
    const addressDetails: AddressDetails = {
      purchaseSize: purchaseSizes[i] || null,
      lastTouched: Date.now(),
      info: await getAddressInfo(tokenInfo, prevMatch),
      mentions: [latestMention, ...(prevMatch?.mentions || [])],
      lastPrice: await fetchPriceWithRetry(address),
      strategiesLastAlertTime: prevMatch?.strategiesLastAlertTime || {},
      strategyAlertCount: prevMatch?.strategyAlertCount || {},
    };

    for (const strategy of strategies) {
      if (runStrategy(address, strategy, addressDetails)) {
        logger.info(
          `${message.id}: 🔒 LOCKED: ${address}: ${strategy.displayName}: ✅ ALERTED`
        );
        // Reset count to 1 if last alert was more than 24 hours ago
        const lastAlertTime = addressDetails.strategiesLastAlertTime?.[strategy.displayName] || 0;
        const hoursSinceLastAlert = (Date.now() - lastAlertTime) / (1000 * 60 * 60);
        
        addressDetails.strategyAlertCount = {
          ...addressDetails.strategyAlertCount || {},
          [strategy.displayName]: hoursSinceLastAlert > 24 ? 1 : (addressDetails.strategyAlertCount?.[strategy.displayName] || 0) + 1
        };

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
    sendMessage(strategy.getAlertChannelId(), message, embed);
    return true;
  }
  return false;
}

/**
 * Handle messages in Altfins Analytics channel
 */
async function handleAltfinsMessage(message: Message) {
  const command = AltfinsAnalyticsChannel.parseCommand(message);

  if (!command) {
    // Not a valid command - ignore silently
    logger.info(`Not an Altfins command in message ${message.id}: "${message.content}"`);
    return;
  }

  logger.info(`Processing Altfins analysis command with params: ${JSON.stringify(command.params)}`);

  // Fetch data from Altfins API
  const data = await fetchAltfinsAnalysis(command.params);

  if (!data) {
    logger.error(`Failed to fetch Altfins analysis for message ${message.id}`);
    await message.reply("❌ Unable to fetch analysis data. Please try again later.");
    return;
  }

  // Create and send embed
  const embed = createAltfinsAnalysisEmbed(data, command.params);

  try {
    await message.reply({ embeds: [embed] });
    logger.info(`Successfully sent Altfins analysis response for message ${message.id}`);
  } catch (error) {
    logger.error(`Error sending Altfins response: ${error}`);
  }
}
