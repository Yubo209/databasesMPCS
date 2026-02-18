import { MysqlDS } from "../datasource/mysql";
import { SqliteDS } from "../datasource/sqlite";

import { Rental } from "../entities/mysql/Rental";
import { FactRental } from "../entities/sqlite/FactRental";

export async function validate() {

  await MysqlDS.initialize();

  await SqliteDS.initialize();


  const mysqlCount =
    await MysqlDS.getRepository(Rental).count();


  const sqliteCount =
    await SqliteDS.getRepository(FactRental).count();


  console.log("MySQL rental:", mysqlCount);

  console.log("SQLite fact_rental:", sqliteCount);


  await MysqlDS.destroy();

  await SqliteDS.destroy();

}
