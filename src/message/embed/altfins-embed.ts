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

/**
 * Create Discord embed for Altfins analytics response
 */
export function createAltfinsAnalyticsEmbed(
  data: AltfinsAnalyticsResponse,
  symbol: string
): EmbedBuilder {
  const embed = new EmbedBuilder();
  embed.setColor("#00D4AA"); // Altfins brand color

  // Title
  embed.setTitle(`📈 Altfins Analytics - ${symbol}`);

  // Results info
  const resultInfo = `Found ${data.numberOfElements} result${data.numberOfElements !== 1 ? 's' : ''}`;
  embed.setDescription(resultInfo);

  // If no results
  if (data.content.length === 0) {
    embed.addFields({
      name: 'No Results',
      value: 'No analytics data found for this symbol.',
      inline: false,
    });
    return embed;
  }

  // Add field for each analytics entry (limit to 10)
  const entriesToShow = data.content.slice(0, 10);

  for (const entry of entriesToShow) {
    const timestamp = new Date(entry.time).toLocaleString();
    const value = entry.nonNumericalValue || entry.value;

    const fieldValue = [
      `**Value:** ${value}`,
      `**Time:** ${timestamp}`,
    ].join('\n');

    embed.addFields({
      name: `Entry ${entriesToShow.indexOf(entry) + 1}`,
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

  // Timestamp
  embed.setTimestamp();

  return embed;
}

/**
 * Create Discord embed for Altfins analytics types list
 * Returns a single embed with just the IDs (friendly names make it too long)
 */
export function createAltfinsAnalyticsTypesEmbed(
  types: AltfinsAnalyticsType[]
): EmbedBuilder[] {
  const embed = new EmbedBuilder();
  embed.setColor("#00D4AA");

  // If no types
  if (types.length === 0) {
    embed.setTitle(`📊 Available Analytics Types`);
    embed.setDescription('No analytics types available.');
    embed.setTimestamp();
    return [embed];
  }

  // Group types by numerical vs non-numerical
  const numericalTypes = types.filter(t => t.isNumerical);
  const nonNumericalTypes = types.filter(t => !t.isNumerical);

  embed.setTitle(`📊 Available Analytics Types`);
  embed.setDescription(`Found ${types.length} analytics types (${numericalTypes.length} numerical, ${nonNumericalTypes.length} non-numerical)`);

  // Show only IDs in a compact format to fit in one embed
  if (numericalTypes.length > 0) {
    // Show first 50 numerical types
    const numList = numericalTypes.slice(0, 50).map(t => t.id).join(', ');
    const numText = numericalTypes.length > 50
      ? `${numList}... (${numericalTypes.length - 50} more)`
      : numList;

    embed.addFields({
      name: `🔢 Numerical Types (${numericalTypes.length})`,
      value: numText.substring(0, 1024), // Ensure under 1024 char limit
      inline: false,
    });
  }

  if (nonNumericalTypes.length > 0) {
    // Show first 50 non-numerical types
    const nonNumList = nonNumericalTypes.slice(0, 50).map(t => t.id).join(', ');
    const nonNumText = nonNumericalTypes.length > 50
      ? `${nonNumList}... (${nonNumericalTypes.length - 50} more)`
      : nonNumList;

    embed.addFields({
      name: `📝 Non-Numerical Types (${nonNumericalTypes.length})`,
      value: nonNumText.substring(0, 1024), // Ensure under 1024 char limit
      inline: false,
    });
  }

  embed.setFooter({ text: 'Use these IDs as analyticsType parameter in analytics command' });
  embed.setTimestamp();

  return [embed];
}

