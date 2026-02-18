import { MysqlDS } from "../datasource/mysql";
import { SqliteDS } from "../datasource/sqlite";

import { Actor } from "../entities/mysql/Actor";
import { DimActor } from "../entities/sqlite/DimActor";
import { SyncState } from "../entities/sqlite/SyncState";

function toDate(dt: Date): string {
  return dt.toISOString().slice(0, 10);
}

export async function fullLoadDimActor() {
  await MysqlDS.initialize();
  await SqliteDS.initialize();
  try {
    const actorRepo = MysqlDS.getRepository(Actor);
    const dimActorRepo = SqliteDS.getRepository(DimActor);
    const syncRepo = SqliteDS.getRepository(SyncState);

    const actors = await actorRepo.find();

    const rows = actors.map((a) => ({
      actor_id: a.actor_id,
      first_name: a.first_name,
      last_name: a.last_name,
      last_update: toDate(a.last_update),
    }));

    await dimActorRepo.upsert(rows, ["actor_id"]);
    let maxMarker = "0000-01-01";
    for (const r of rows)
      if (r.last_update > maxMarker)
        maxMarker = r.last_update;

    await syncRepo.upsert(
      { table_name: "actor", last_marker: maxMarker },
      ["table_name"]
    );

  } finally {

    await MysqlDS.destroy();
    await SqliteDS.destroy();

  }

}
