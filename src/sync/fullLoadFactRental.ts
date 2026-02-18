import { MysqlDS } from "../datasource/mysql";
import { SqliteDS } from "../datasource/sqlite";

import { Rental } from "../entities/mysql/Rental";
import { Inventory } from "../entities/mysql/Inventory";

import { DimFilm } from "../entities/sqlite/DimFilm";
import { DimCustomer } from "../entities/sqlite/DimCustomer";
import { DimStore } from "../entities/sqlite/DimStore";

import { FactRental } from "../entities/sqlite/FactRental";
import { SyncState } from "../entities/sqlite/SyncState";

function dateKey(d: Date): number {
  return Number(d.toISOString().slice(0, 10).replace(/-/g, ""));
}

export async function fullLoadFactRental() {

  await MysqlDS.initialize();
  await SqliteDS.initialize();

  try {

    const rentalRepo = MysqlDS.getRepository(Rental);
    const inventoryRepo = MysqlDS.getRepository(Inventory);

    const factRepo = SqliteDS.getRepository(FactRental);
    const syncRepo = SqliteDS.getRepository(SyncState);

    const filmMap = new Map(
      (await SqliteDS.getRepository(DimFilm).find())
        .map(f => [f.film_id, f.film_key])
    );

    const custMap = new Map(
      (await SqliteDS.getRepository(DimCustomer).find())
        .map(c => [c.customer_id, c.customer_key])
    );

    const storeMap = new Map(
      (await SqliteDS.getRepository(DimStore).find())
        .map(s => [s.store_id, s.store_key])
    );

    const inventory = await inventoryRepo.find();
    const invMap = new Map(inventory.map(i => [i.inventory_id, i]));

    const rentals = await rentalRepo.find();

    const rows = rentals.map(r => {

      const inv = invMap.get(r.inventory_id)!;


      const rentalDate = r.rental_date;
      const returnDate = r.return_date ?? rentalDate;

      const days =
        Math.floor(
          (returnDate.getTime() - rentalDate.getTime()) /
          (1000 * 60 * 60 * 24)
        );

      return {

        rental_id: r.rental_id,

        date_key_rented: dateKey(rentalDate),

        date_key_returned: dateKey(returnDate),

        film_key: filmMap.get(inv.film_id),

        store_key: storeMap.get(inv.store_id),

        customer_key: custMap.get(r.customer_id),

        staff_id: r.staff_id,

        rental_duration_days: days

      };

    });

    await factRepo.clear();

    await factRepo.insert(rows);

    const maxMarker =
      rentals.length
        ? rentals[rentals.length - 1].last_update.toISOString().slice(0, 10)
        : "0000-01-01";

    await syncRepo.upsert(
      { table_name: "rental", last_marker: maxMarker },
      ["table_name"]
    );

  } finally {

    await MysqlDS.destroy();
    await SqliteDS.destroy();

  }

}
