import { EmbedBuilder } from "discord.js";
import { getFields } from "./get-fields";
import { formatNumber } from "../../utils/number";

export function getEmbed(
  address: string,
  addressDetails: AddressDetails,
  filterMentions: (mentions: Mention[]) => Mention[]
) {
  const embed = new EmbedBuilder();
  const { info } = addressDetails;
  embed.setColor("#0099ff");

  let description = "";
  if (info) {
    embed.setTitle(`${info.name} | \`${info.symbol}\``);
    description = `\`\`\`${address}\`\`\`\nMultiple mentions in last 24 hours:`;

    if (info.imageUrl) embed.setThumbnail(info.imageUrl);
  } else {
    embed.setTitle(`\`\`\`${address}\`\`\``);
    description = `Multiple mentions in last 24 hours:`;
  }

  const priceDescription = `Price  |  ${
    addressDetails.lastPrice?.price ?? "N/A"
  } \n FDV    |  ${formatNumber(addressDetails.lastPrice?.fdv ?? "N/A")} \n Amount   |  $${(addressDetails.purchaseSize ?? "N/A")}`;
  embed.setDescription(`${priceDescription} \n\n ${description}\n\n`);

  embed.addFields(getFields(filterMentions(addressDetails.mentions)));

  let value = "";
  if (info?.twitterHandle) {
    value += `🐦 [Twitter](https://twitter.com/${info.twitterHandle})\n`;
  }
  if (info?.telegramHandle) {
    value += `📬 [Telegram](https://t.me/${info.telegramHandle})\n`;
  }
  if (info?.discordUrl) {
    value += `💬 [Discord](${info.discordUrl})\n`;
  }
  if (info?.websites) {
    for (const website of info.websites) {
      if (website.startsWith("https://")) {
        value += `🌐 [Website](${website})\n`;
      }
    }
  }
  if (value !== "") {
    embed.addFields({ name: "Socials", value, inline: false });
  }

  embed.addFields({
    name: "Tools",
    value: `[BullX](https://neo.bullx.io/terminal?chainId=1399811149&address=${address}) | [Nansen](https://app.nansen.ai/token-god-mode?tokenAddress=${address}&chain=solana) | [TrenchBot](https://trench.bot/bundles/${address}) | [Dexscreener](https://dexscreener.com/solana/${address}) | [Gmgn](https://gmgn.ai/sol/token/${address})`,
    inline: false,
  });

  return embed;
}
