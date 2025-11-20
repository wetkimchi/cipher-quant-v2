import { EmbedBuilder } from "discord.js";

/**
 * Create Discord embed for Altfins analysis response
 */
export function createAltfinsAnalysisEmbed(
  data: AltfinsAnalysisResponse,
  params: AltfinsAnalysisParams
): EmbedBuilder {
  const embed = new EmbedBuilder();
  embed.setColor("#00D4AA"); // Altfins brand color

  // Title
  embed.setTitle(`📊 Altfins Technical Analysis - ${params.symbol}`);

  // Results info
  const resultInfo = `Found ${data.numberOfElements} result${data.numberOfElements !== 1 ? 's' : ''}`;
  embed.setDescription(resultInfo);

  // If no results
  if (data.content.length === 0) {
    embed.addFields({
      name: 'No Results',
      value: 'No analysis data found for the given criteria.',
      inline: false,
    });
    return embed;
  }

  // Add field for each coin (limit to 10 for readability)
  const coinsToShow = data.content.slice(0, 10);
  
  for (const coin of coinsToShow) {
    // Truncate description if too long
    const description = coin.description.length > 150 
      ? coin.description.substring(0, 150) + '...'
      : coin.description;

    const fieldValue = [
      `**Outlook:** ${coin.nearTermOutlook}`,
      `**Pattern:** ${coin.patternType} (${coin.patternStage})`,
      `**Updated:** ${new Date(coin.updatedDate).toLocaleDateString()}`,
      description ? `**Description:** ${description}` : '',
      `[View Chart](${coin.imgChartUrl})`,
    ].filter(Boolean).join('\n');
    
    embed.addFields({
      name: `${coin.symbol} - ${coin.friendlyName}`,
      value: fieldValue,
      inline: false,
    });
  }

  // If showing fewer than total content
  if (data.content.length > 10) {
    embed.addFields({
      name: '⚠️ Results Truncated',
      value: `Showing first 10 of ${data.content.length} results.`,
      inline: false,
    });
  }

  // Add chart image and logo from first result
  if (coinsToShow.length > 0) {
    embed.setImage(coinsToShow[0].imgChartUrl);
    if (coinsToShow[0].logoUrl) {
      embed.setThumbnail(coinsToShow[0].logoUrl);
    }
  }

  // Timestamp
  embed.setTimestamp();

  return embed;
}

