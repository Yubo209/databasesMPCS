import { MysqlDS } from "../datasource/mysql";
import { SqliteDS } from "../datasource/sqlite";
import { Rental } from "../entities/mysql/Rental";
import { Payment } from "../entities/mysql/Payment";
import { DimDate } from "../entities/sqlite/DimDate";
export async function fullLoadDimDate() {
  await MysqlDS.initialize();
  await SqliteDS.initialize();
  try {
    const rentalRepo = MysqlDS.getRepository(Rental);
    const paymentRepo = MysqlDS.getRepository(Payment);
    const dimRepo = SqliteDS.getRepository(DimDate);
    const rentalDates = await rentalRepo.find();
    const paymentDates = await paymentRepo.find();
    const set = new Set<string>();
    rentalDates.forEach(r =>
      set.add(r.rental_date.toISOString().slice(0, 10))
    );
    rentalDates.forEach(r => {
      if (r.return_date)
        set.add(r.return_date.toISOString().slice(0, 10));
    });
    paymentDates.forEach(p =>
      set.add(p.payment_date.toISOString().slice(0, 10))
    );
    const rows = Array.from(set).map(d => {
      const dt = new Date(d);
      const year = dt.getFullYear();
      const month = dt.getMonth() + 1;
      const day = dt.getDate();
      const dow = dt.getDay();
      const day_of_week = dow === 0 ? 7 : dow;
      const is_weekend = dow === 0 || dow === 6 ? 1 : 0;
      const quarter = Math.floor((month - 1) / 3) + 1;

      return {
        date_key: Number(d.replace(/-/g, "")),
        date: d,
        year,
        quarter,
        month,
        day_of_month: day,
        day_of_week,
        is_weekend
      };
    });
    await dimRepo.upsert(rows, ["date_key"]);
  } finally {
    await MysqlDS.destroy();
    await SqliteDS.destroy();
  }
}
