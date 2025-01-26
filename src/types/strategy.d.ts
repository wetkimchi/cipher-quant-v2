type Strategy = {
  displayName: string;
  alertChannelId: string;
  areConditionsValidForAlert: (
    address: string,
    details: AddressDetails
  ) => boolean;
  filterMentions: (mentions: Mention[]) => Mention[];
  getMessage: (address: string, details: AddressDetails) => string;
};
