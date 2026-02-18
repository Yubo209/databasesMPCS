import { SqliteDS } from "../datasource/sqlite";

export async function initAnalyticsDb() {

  await SqliteDS.initialize();

  await SqliteDS.destroy();

}
