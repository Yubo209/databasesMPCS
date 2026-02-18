import { MysqlDS } from "../datasource/mysql";
import { SqliteDS } from "../datasource/sqlite";
import { FilmActor } from "../entities/mysql/FilmActor";
import { DimFilm } from "../entities/sqlite/DimFilm";
import { DimActor } from "../entities/sqlite/DimActor";
import { BridgeFilmActor } from "../entities/sqlite/BridgeFilmActor";
export async function fullLoadBridgeFilmActor() {
  await MysqlDS.initialize();
  await SqliteDS.initialize();
  try {
    const filmActorRepo = MysqlDS.getRepository(FilmActor);

    const dimFilmRepo = SqliteDS.getRepository(DimFilm);
    const dimActorRepo = SqliteDS.getRepository(DimActor);

    const bridgeRepo = SqliteDS.getRepository(BridgeFilmActor);

    const films = await dimFilmRepo.find();
    const actors = await dimActorRepo.find();

    const filmMap = new Map(films.map(f => [f.film_id, f.film_key]));
    const actorMap = new Map(actors.map(a => [a.actor_id, a.actor_key]));

    const rows = await filmActorRepo.find();

    const bridgeRows = rows.map(r => ({

      film_key: filmMap.get(r.film_id),

      actor_key: actorMap.get(r.actor_id)

    }));

    await bridgeRepo.clear();

    await bridgeRepo.insert(bridgeRows);

  } finally {

    await MysqlDS.destroy();
    await SqliteDS.destroy();

  }

}
