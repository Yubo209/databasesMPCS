import { MysqlDS } from "../datasource/mysql";
import { SqliteDS } from "../datasource/sqlite";
import { Film } from "../entities/mysql/Film";
import { Language } from "../entities/mysql/Language";
import { DimFilm } from "../entities/sqlite/DimFilm";
import { SyncState } from "../entities/sqlite/SyncState";

function toDateOrDateTime(dt: Date): string {
  return dt.toISOString().slice(0, 10);
}

export async function syncDimFilm() {
  console.log("== sync(update): dim_film ==");
  await MysqlDS.initialize();
  await SqliteDS.initialize();

  try {
    const filmRepo = MysqlDS.getRepository(Film);
    const langRepo = MysqlDS.getRepository(Language);
    const dimFilmRepo = SqliteDS.getRepository(DimFilm);
    const syncRepo = SqliteDS.getRepository(SyncState);

    
    const state = await syncRepo.findOneBy({ table_name: "film" });
    const marker = state?.last_marker ?? null;
    const languages = await langRepo.find();
    const languageMap = new Map<number, string>();
    for (const l of languages) languageMap.set(l.language_id, l.name);

    const films = !marker
      ? await filmRepo.find()
      : await filmRepo
          .createQueryBuilder("f")
          .where("f.last_update > :marker", { marker })
          .getMany();

    if (films.length === 0) {
      console.log(`No changes since marker=${marker}.`);
      return;
    }

    const rows = films.map((f) => ({
      film_id: f.film_id,
      title: f.title,
      rating: f.rating,
      length: f.length,
      language: languageMap.get(f.language_id),
      release_year: f.release_year,
      last_update: toDateOrDateTime(f.last_update),
    }));

    await dimFilmRepo.upsert(rows, ["film_id"]);

    let newMarker = marker ?? "0000-01-01";
    for (const r of rows) 
        if (r.last_update > newMarker) 
            newMarker = r.last_update;

    await syncRepo.upsert({ table_name: "film", last_marker: newMarker }, ["table_name"]);

    console.log(` dim_film synced (${rows.length}), marker=${newMarker}`);
  } finally {
    await MysqlDS.destroy();
    await SqliteDS.destroy();
  }
}
