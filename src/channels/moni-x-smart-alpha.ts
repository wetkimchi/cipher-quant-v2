import { Message } from "discord.js";
import { getAllAddresses } from "../regex";

const channelId = "1303048307437736017";
const displayName = "MONI_X_SMART_ALPHA";

// "description": "**followed** @\\_Mizuki\\_exe:\n\n**Description:** Hacker of shadows | self-aware digital enigma. Breaking systems, not hearts.\n\nCA :: 9XS6ayT8aCaoH7tDmTgNyEXRLeVpgyHKtZk5xTXpump\n\n🔮**Moni Score**: `820`\nCA: [CG](https://www.geckoterminal.com/solana/pools/BhQgvhYpYVccRt5wJnxi13waXNaC3dJVcX6TjTNY9kee) | [DS](https://dexscreener.com/solana/C3JX9TWLqHKmcoTDTppaJebX2U7DcUQDEHVSmJFz6K6S)\n👤**Followers**: `5776` (`81` Smarts🧠) \n Top 3 [@Rewkang](https://x.com/Rewkang), [@Fiskantes](https://x.com/Fiskantes), [@inversebrah](https://x.com/inversebrah)\n- Influencers: `17`\n- Project team: `12`\n- DAOs/Groups members: `11`\n- VC/Fund team: `6`\n- Angel Investors: `1`\n\n- Tweets: `145` \n- Category: `Memecoin`\n- Network: `Solana` \n- Account created: `Nov 24`\n\n**♻️ Previous handles:** - \n\n📊 **[See all stats](https://discover.getmoni.io/_Mizuki_exe) | View [twitter](https://x.com/_Mizuki_exe)**\n\n🔎 by [Moni Discover](https://discover.getmoni.io/) (None)"

function extractAddresses(message: Message): string[] {
  const embed = message.embeds[0];
  const description = embed.description ?? "";

  const followedAccountDetails = description.split("**Moni Score**")[0];

  return [...getAllAddresses(followedAccountDetails)];
}

export function extractSmartFollowersCount(description: string): number {
  // use regex and extract smart number from such \n👤**Followers**: `5776` (`81` Smarts🧠) \n
  const smartFollowersRegex = /\(`(\d+)` Smarts🧠\)/;
  const smartFollowersCount = smartFollowersRegex.exec(description)?.[1];
  return parseInt(smartFollowersCount ?? "0");
}

function getDetails(mention: Mention): string[] {
  const description = mention.embeds[0].description ?? "";

  const smartFollowersCount = extractSmartFollowersCount(description);
  if (smartFollowersCount === 0) return [];

  return [`Smarts🧠: ${smartFollowersCount}`];
}

export const MoniXSmartAlphaChannel = {
  channelId,
  displayName,
  extractAddresses,
  getDetails,
};
