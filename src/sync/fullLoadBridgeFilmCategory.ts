import { MysqlDS } from "../datasource/mysql";
import { SqliteDS } from "../datasource/sqlite";
import { FilmCategory } from "../entities/mysql/FilmCategory";
import { DimFilm } from "../entities/sqlite/DimFilm";
import { DimCategory } from "../entities/sqlite/DimCategory";
import { BridgeFilmCategory } from "../entities/sqlite/BridgeFilmCategory";
export async function fullLoadBridgeFilmCategory() {
  await MysqlDS.initialize();
  await SqliteDS.initialize();
  try {
    const filmCategoryRepo = MysqlDS.getRepository(FilmCategory);
    const dimFilmRepo = SqliteDS.getRepository(DimFilm);
    const dimCategoryRepo = SqliteDS.getRepository(DimCategory);

    const bridgeRepo = SqliteDS.getRepository(BridgeFilmCategory);
    const films = await dimFilmRepo.find();
    const cats = await dimCategoryRepo.find();
    const filmMap = new Map(films.map(f => [f.film_id, f.film_key]));
    const catMap = new Map(cats.map(c => [c.category_id, c.category_key]));
    const rows = await filmCategoryRepo.find();

    const bridgeRows = rows.map(r => ({

      film_key: filmMap.get(r.film_id),

      category_key: catMap.get(r.category_id)

    }));
    await bridgeRepo.clear();
    await bridgeRepo.insert(bridgeRows);
  } finally {
    await MysqlDS.destroy();
    await SqliteDS.destroy();
  }

}
