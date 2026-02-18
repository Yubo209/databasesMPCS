import { MysqlDS } from "../datasource/mysql";
import { SqliteDS } from "../datasource/sqlite";

import { Payment } from "../entities/mysql/Payment";
import { Rental } from "../entities/mysql/Rental";
import { Inventory } from "../entities/mysql/Inventory";

import { DimCustomer } from "../entities/sqlite/DimCustomer";
import { DimStore } from "../entities/sqlite/DimStore";
import { FactPayment } from "../entities/sqlite/FactPayment";
import { SyncState } from "../entities/sqlite/SyncState";


function toDate(dt: Date): string {
  return dt.toISOString().slice(0, 10);
}

function toDateKey(dt: Date): number {
  return Number(toDate(dt).replace(/-/g, ""));

}


export async function fullLoadFactPayment() {

  await MysqlDS.initialize();
  await SqliteDS.initialize();

  try {

    const paymentRepo = MysqlDS.getRepository(Payment);
    const rentalRepo = MysqlDS.getRepository(Rental);
    const inventoryRepo = MysqlDS.getRepository(Inventory);

    const customerRepo = SqliteDS.getRepository(DimCustomer);
    const storeRepo = SqliteDS.getRepository(DimStore);
    const factRepo = SqliteDS.getRepository(FactPayment);
    const syncRepo = SqliteDS.getRepository(SyncState);


    const payments = await paymentRepo.find();

    const rentals = await rentalRepo.find();

    const inventory = await inventoryRepo.find();

    const customers = await customerRepo.find();

    const stores = await storeRepo.find();


    const rentalMap = new Map(rentals.map(r => [r.rental_id, r]));

    const invMap = new Map(inventory.map(i => [i.inventory_id, i]));

    const customerMap = new Map(customers.map(c => [c.customer_id, c.customer_key]));

    const storeMap = new Map(stores.map(s => [s.store_id, s.store_key]));


    const rows = payments.map(p => {

      const rental = rentalMap.get(p.rental_id)!;

      const inv = invMap.get(rental.inventory_id)!;

      return {

        payment_id: p.payment_id,

        date_key_paid: toDateKey(p.payment_date),

        customer_key: customerMap.get(p.customer_id),

        store_key: storeMap.get(inv.store_id),

        staff_id: p.staff_id,

        amount: p.amount,

        last_update: toDate(p.last_update)

      };

    });


    await factRepo.upsert(rows, ["payment_id"]);


    let maxMarker = "0000-01-01";

    for (const r of rows)
      if (r.last_update > maxMarker)
        maxMarker = r.last_update;


    await syncRepo.upsert(
      { table_name: "payment", last_marker: maxMarker },
      ["table_name"]
    );


  } finally {

    await MysqlDS.destroy();

    await SqliteDS.destroy();

  }

}
