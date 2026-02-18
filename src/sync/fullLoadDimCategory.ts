import { MysqlDS } from "../datasource/mysql";
import { SqliteDS } from "../datasource/sqlite";

import { Category } from "../entities/mysql/Category";
import { DimCategory } from "../entities/sqlite/DimCategory";
import { SyncState } from "../entities/sqlite/SyncState";

function toDate(dt: Date): string {
  return dt.toISOString().slice(0, 10);
}

export async function fullLoadDimCategory() {

  await MysqlDS.initialize();
  await SqliteDS.initialize();

  try {

    const repo = MysqlDS.getRepository(Category);
    const dimRepo = SqliteDS.getRepository(DimCategory);
    const syncRepo = SqliteDS.getRepository(SyncState);

    const data = await repo.find();

    const rows = data.map((c) => ({
      category_id: c.category_id,
      name: c.name,
      last_update: toDate(c.last_update),
    }));

    await dimRepo.upsert(rows, ["category_id"]);

    let maxMarker = "0000-01-01";

    for (const r of rows)
      if (r.last_update > maxMarker)
        maxMarker = r.last_update;

    await syncRepo.upsert(
      { table_name: "category", last_marker: maxMarker },
      ["table_name"]
    );

  } finally {

    await MysqlDS.destroy();
    await SqliteDS.destroy();

  }

}
