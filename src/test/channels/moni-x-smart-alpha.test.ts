import { extractSmartFollowersCount } from "../../channels/moni-x-smart-alpha";

describe("MoniXSmartAlpha", () => {
  describe("extractSmartFollowersCount", () => {
    it("should extract smart followers count when present", () => {
      const description = "👤**Followers**: `5776` (`81` Smarts🧠) \n";
      expect(extractSmartFollowersCount(description)).toBe(81);
    });

    it("should return 0 when no smart followers count is present", () => {
      const description = "👤**Followers**: `5776`\n";
      expect(extractSmartFollowersCount(description)).toBe(0);
    });

    it("should return 0 when description is empty", () => {
      expect(extractSmartFollowersCount("")).toBe(0);
    });

    it("should extract smart followers count from a full description", () => {
      const description = `**followed** @\_Mizuki\_exe:
        **Description:** Hacker of shadows
        👤**Followers**: \`5776\` (\`81\` Smarts🧠) \n
        - Tweets: \`145\``;
      expect(extractSmartFollowersCount(description)).toBe(81);
    });
  });
});
