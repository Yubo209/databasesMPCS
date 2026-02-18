import { MysqlDS } from "../datasource/mysql";
import { SqliteDS } from "../datasource/sqlite";

import { Store } from "../entities/mysql/Store";
import { DimStore } from "../entities/sqlite/DimStore";
import { SyncState } from "../entities/sqlite/SyncState";

function toDate(dt: Date): string {
  return dt.toISOString().slice(0, 10);
}

export async function syncDimStore() {

  await MysqlDS.initialize();
  await SqliteDS.initialize();
  try {

    const repo = MysqlDS.getRepository(Store);
    const dimRepo = SqliteDS.getRepository(DimStore);
    const syncRepo = SqliteDS.getRepository(SyncState);

    const state = await syncRepo.findOneBy({ table_name: "store" });
    const marker = state?.last_marker ?? null;

    const qb = repo
      .createQueryBuilder("s")
      .leftJoinAndSelect("s.address", "a")
      .leftJoinAndSelect("a.city", "ci")
      .leftJoinAndSelect("ci.country", "co");

    if (marker) qb.where("s.last_update > :marker", { marker });

    const stores = await qb.getMany();

    if (stores.length === 0) return;

    const rows = stores.map((s) => ({
      store_id: s.store_id,
      city: s.address.city.city,
      country: s.address.city.country.country,
      last_update: toDate(s.last_update),
    }));

    await dimRepo.upsert(rows, ["store_id"]);

    let maxMarker = marker ?? "0000-01-01";
    for (const r of rows) if (r.last_update > maxMarker) maxMarker = r.last_update;

    await syncRepo.upsert(
      { table_name: "store", last_marker: maxMarker },
      ["table_name"]
    );

  } finally {

    await MysqlDS.destroy();
    await SqliteDS.destroy();

  }

}
