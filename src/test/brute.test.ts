import { Message } from "discord.js";
import { extractAddresses } from "../channels/common/brute";

describe("extractAddresses", () => {
  const solanaDescription =
    "**followed** @IQ6900\\_:\n\n**Description:** Code everything in\nAI & Meme live forever onchain.\n\nCA:AsyfR3e5JcPqWot4H5MMhQUm7DZ4zwQrcp2zbB7vpump \nTG: https://t.co/Er8J9tsi8q \nBot: @MakeCodeIn\n\n🔮**Moni Score**: `276`\n👤**Followers**: `2853` (`28` Smarts🧠) \n Top 3 [@notsofast](https://x.com/notsofast), [@OGDfarmer](https://x.com/OGDfarmer), [@shawmakesmagic](https://x.com/shawmakesmagic)\n- Influencers: `8`\n- Project team: `5`\n- DAOs/Groups members: `3`\n- Angel Investors: `1`\n- VC/Fund team: `1`\n\n- Tweets: `665` \n- Category: `Memecoin`\n- Network: `Solana` \n- Account created: `Sep 07`\n\n**♻️ Previous handles:** - \n\n📊 **[See all stats](https://discover.getmoni.io/IQ6900_) | View [twitter](https://x.com/IQ6900_)**\n\n🔎 by [Moni Discover](https://discover.getmoni.io/) (None)";
  const baseDescription =
    "**followed** @GuancialeAI:\n\n**Description:** A peanut-shaped rebel and autonomous trading bot. Powered by AI, fueled by $GUAN. \nCreator: @kieranwarwick\nContract: 0xcc0adb6c436eb1f65b2f27733bf926691b94c5f1\n\n🔮**Moni Score**: `375`\n👤**Followers**: `1514` (`39` Smarts🧠) \n Top 3 [@OGDfarmer](https://x.com/OGDfarmer), [@SmallCapScience](https://x.com/SmallCapScience), [@kaiynne](https://x.com/kaiynne)\n- Influencers: `11`\n- Project team: `9`\n- DAOs/Groups members: `8`\n- VC/Fund team: `5`\n- Angel Investors: `2`\n\n- Tweets: `220` \n- Account created: `Nov 14`\n\n**♻️ Previous handles:** - \n\n📊 **[See all stats](https://discover.getmoni.io/GuancialeAI) | View [twitter](https://x.com/GuancialeAI)**\n\n🔎 by [Moni Discover](https://discover.getmoni.io/) (None)";

  it("should extract Ethereum and Solana addresses from the message description", () => {
    const message = {
      content: "",
      embeds: [
        {
          description: solanaDescription + baseDescription,
          toJSON: () => ({ description: solanaDescription + baseDescription }),
        },
      ],
    } as unknown as Message;

    const result = extractAddresses(message);

    expect(result).toEqual([
      "0xcc0adb6c436eb1f65b2f27733bf926691b94c5f1",
      "AsyfR3e5JcPqWot4H5MMhQUm7DZ4zwQrcp2zbB7vpump",
    ]);
  });

  it("should return an empty array if no addresses are found", () => {
    const message = {
      content: "",
      embeds: [
        {
          description: "Nothing to see here",
          toJSON: () => ({ description: "Nothing to see here" }),
        },
      ],
    } as unknown as Message;

    const result = extractAddresses(message);

    expect(result).toEqual([]);
  });

  it("should filter out Solana addresses that are part of any Ethereum address", () => {
    const message = {
      content: "",
      embeds: [
        {
          description: baseDescription,
          toJSON: () => ({ description: baseDescription }),
        },
      ],
    } as unknown as Message;

    const result = extractAddresses(message);

    expect(result).toEqual(["0xcc0adb6c436eb1f65b2f27733bf926691b94c5f1"]);
  });
});
