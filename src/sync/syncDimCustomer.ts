import { MysqlDS } from "../datasource/mysql";
import { SqliteDS } from "../datasource/sqlite";

import { Customer } from "../entities/mysql/Customer";
import { DimCustomer } from "../entities/sqlite/DimCustomer";
import { SyncState } from "../entities/sqlite/SyncState";

function toDate(dt: Date): string {
  return dt.toISOString().slice(0, 10);
}

export async function syncDimCustomer() {

  await MysqlDS.initialize();
  await SqliteDS.initialize();

  try {

    const repo = MysqlDS.getRepository(Customer);
    const dimRepo = SqliteDS.getRepository(DimCustomer);
    const syncRepo = SqliteDS.getRepository(SyncState);
    const state = await syncRepo.findOneBy({ table_name: "customer" });
    const marker = state?.last_marker ?? null;
    const qb = repo
      .createQueryBuilder("c")
      .leftJoinAndSelect("c.address", "a")
      .leftJoinAndSelect("a.city", "ci")
      .leftJoinAndSelect("ci.country", "co");
    if (marker) qb.where("c.last_update > :marker", { marker });

    const customers = await qb.getMany();

    if (customers.length === 0) return;

    const rows = customers.map((c) => ({
      customer_id: c.customer_id,
      first_name: c.first_name,
      last_name: c.last_name,
      active: c.active,
      city: c.address.city.city,
      country: c.address.city.country.country,
      last_update: toDate(c.last_update),
    }));

    await dimRepo.upsert(rows, ["customer_id"]);

    let maxMarker = marker ?? "0000-01-01";
    for (const r of rows) if (r.last_update > maxMarker) maxMarker = r.last_update;

    await syncRepo.upsert(
      { table_name: "customer", last_marker: maxMarker },
      ["table_name"]
    );

  } finally {

    await MysqlDS.destroy();
    await SqliteDS.destroy();

  }

}
