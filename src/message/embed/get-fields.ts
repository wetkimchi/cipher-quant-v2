import { getFieldValue } from "./get-field";
const MENTION_LIMIT = 5;

export function getFields(mentions: Mention[]) {
  const fields = mentions
    .map((mention) => getFieldValue(mention))
    .filter((field) => field !== undefined);

  return {
    name: "Mentions",
    value: fields.slice(0, MENTION_LIMIT).join("\n"),
  };
}
