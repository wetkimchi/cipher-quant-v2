type Mention = {
  timestamp: number;
  guildId: string;
  channelId: string;
  messageId: string;

  content: string;
  embeds: any[];
};

type Address = string;
interface AddressDetails {
  lastTouched: number;
  purchaseSize: number | null;
  strategiesLastAlertTime?: Record<string, number>;
  strategyAlertCount?: Record<string, number>;
  info: TokenInfo | null;
  mentions: Mention[];
  lastPrice: { price: string; fdv: string } | null;
}

type StoreMap = Map<Address, AddressDetails>;

// interface Store {
//   get(address: Address): Promise<AddressDetails | undefined>;
//   set(address: Address, details: AddressDetails): Promise<void>;
//   delete(address: Address): Promise<void>;
//   acquireLock(): Promise<void>;
//   releaseLock(): Promise<void>;
// }
