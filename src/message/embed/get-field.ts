import { rawChannels } from "../../channels";
import { getMessageLink, timeAgo } from "../../utils";

export function getFieldValue(mention: Mention) {
  if (!rawChannels[mention.channelId]) {
    return;
  }

  let value = `🔗 [${rawChannels[mention.channelId].displayName.padEnd(
    23,
    " "
  )}](${getMessageLink(mention)}) | ${timeAgo(mention.timestamp)}`;

  const details = rawChannels[mention.channelId].getDetails?.(mention);

  if (details && details.length > 0) {
    value += ` | ${details.join(" | ")}`;
  }

  return value;
}
