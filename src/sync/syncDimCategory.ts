import { MysqlDS } from "../datasource/mysql";
import { SqliteDS } from "../datasource/sqlite";

import { Category } from "../entities/mysql/Category";
import { DimCategory } from "../entities/sqlite/DimCategory";
import { SyncState } from "../entities/sqlite/SyncState";

function toDate(dt: Date): string {
  return dt.toISOString().slice(0, 10);
}
export async function syncDimCategory() {
  await MysqlDS.initialize();
  await SqliteDS.initialize();

  try {
    const repo = MysqlDS.getRepository(Category);
    const dimRepo = SqliteDS.getRepository(DimCategory);
    const syncRepo = SqliteDS.getRepository(SyncState);

    const state = await syncRepo.findOneBy({ table_name: "category" });
    const marker = state?.last_marker ?? null;

    const cats = !marker
      ? await repo.find()
      : await repo
          .createQueryBuilder("c")
          .where("c.last_update > :marker", { marker })
          .getMany();

    if (cats.length === 0) return;

    const rows = cats.map((c) => ({
      category_id: c.category_id,
      name: c.name,
      last_update: toDate(c.last_update),
    }));

    await dimRepo.upsert(rows, ["category_id"]);

    let maxMarker = marker ?? "0000-01-01";
    for (const r of rows) if (r.last_update > maxMarker) maxMarker = r.last_update;

    await syncRepo.upsert(
      { table_name: "category", last_marker: maxMarker },
      ["table_name"]
    );

  } finally {

    await MysqlDS.destroy();
    await SqliteDS.destroy();

  }

}
