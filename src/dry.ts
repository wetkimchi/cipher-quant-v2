import "./setup";
import { mainStore } from "./store";

async function main() {
  const store = mainStore.get("B7D6yG93e4dNArwQ7SWJFwEbd7z2uBNSuji8oY9Hpump");
  console.log(store?.strategiesLastAlertTime?.["High_Conviction_Alerts"]);
}

main();
