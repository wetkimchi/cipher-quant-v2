import * as fs from "fs";
import { Mutex } from "async-mutex";

// Time threshold in milliseconds (e.g., 24 hours)
const TIME_THRESHOLD = 24 * 60 * 60 * 1000;
export class Store {
  private readonly store: StoreMap;
  private readonly filePath: string;
  private readonly mutex: Mutex;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.store = this.loadStore();
    this.mutex = new Mutex();
    this.setupIntervals();
  }

  private loadStore(): StoreMap {
    return fs.existsSync(this.filePath)
      ? new Map(
          Object.entries(JSON.parse(fs.readFileSync(this.filePath, "utf8")))
        )
      : new Map();
  }

  private ensureBackupDirectoryExists() {
    const dir = './backup';
    if (!fs.existsSync(dir)) {
      logger.info('Creating backup directory...');
      fs.mkdirSync(dir);
    }
  }

  private setupIntervals() {
    this.ensureBackupDirectoryExists();
    // Add locks to prevent concurrent access during cleanup/backup
    setInterval(async () => {
      await this.cleanOldEntries();
    }, 10 * 60 * 1000);

    setInterval(async () => {
      await fs.promises.writeFile(
        this.filePath,
        JSON.stringify(Object.fromEntries(this.store), null, 2)
      );
      logger.info(`${this.filePath} backup to file. Size: ${this.store.size}`);
    }, 1 * 60 * 1000);
  }

  private async cleanOldEntries(): Promise<void> {
    logger.info(`LOCKING: for cleaning old entries.`);
    await this.mutex.acquire();
    logger.info(`LOCKED: for cleaning old entries`);

    const now = Date.now();
    let n = 0;
    let m = 0;
    for (const [address, { lastTouched, mentions }] of this.store.entries()) {
      if (now - lastTouched > TIME_THRESHOLD) {
        this.delete(address);
        n += 1;
      }

      for (let i = 0; i < mentions.length; i++) {
        if (now - mentions[i].timestamp > TIME_THRESHOLD) {
          m++;
          mentions.splice(i);
          if (i === 0) {
            this.delete(address);
            n++;
          }
          break;
        }
      }
    }
    logger.info(`Cleaned ${n} old entries from ${this.filePath}`);
    logger.info(`Cleaned ${m} old mentions from ${this.filePath}`);

    logger.info(`RELEASING: lock for cleaning old entries`);
    this.mutex.release();
    logger.info(`RELEASED: lock for cleaning old entries`);
  }

  // Public methods need mutex protection too
  public get(key: Address): AddressDetails | undefined {
    return this.store.get(key);
  }

  public set(key: Address, value: AddressDetails): void {
    this.store.set(key, value);
  }

  public delete(key: Address): void {
    this.store.delete(key);
  }

  public async acquireLock(): Promise<void> {
    await this.mutex.acquire();
  }

  public releaseLock(): void {
    this.mutex.release();
  }
}

// Singleton pattern for store management
class StoreManager {
  private static instance: StoreManager;
  private readonly stores: Map<string, Store>;

  private constructor() {
    this.stores = new Map();
  }

  public static getInstance(): StoreManager {
    if (!StoreManager.instance) {
      StoreManager.instance = new StoreManager();
    }
    return StoreManager.instance;
  }

  public getStore(name: string): Store {
    if (!this.stores.has(name)) {
      const filePath = `./backup/${name}.json`;
      this.stores.set(name, new Store(filePath));
    }
    return this.stores.get(name)!;
  }
}

// Export the manager and create convenience exports for common stores
export const storeManager = StoreManager.getInstance();
export const mainStore = storeManager.getStore("store");
