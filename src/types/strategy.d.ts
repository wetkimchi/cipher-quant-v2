type Strategy = {
  displayName: string;
  alertChannelId: string;
  alertTestChannelId: string;
  areConditionsValidForAlert: (
    address: string,
    details: AddressDetails
  ) => boolean;
  filterMentions: (mentions: Mention[]) => Mention[];
  getMessage: (address: string, details: AddressDetails) => string;
  getAlertChannelId: () => string;
};
