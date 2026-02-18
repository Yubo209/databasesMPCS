import "reflect-metadata"
import { DataSource } from "typeorm"
import "dotenv/config"
import { SyncState } from "../entities/sqlite/SyncState"
import { DimDate } from "../entities/sqlite/DimDate";
import { DimFilm } from "../entities/sqlite/DimFilm";
import { DimActor } from "../entities/sqlite/DimActor"; 
import { DimCategory } from "../entities/sqlite/DimCategory"; 
import { DimStore } from "../entities/sqlite/DimStore"; 
import { DimCustomer } from "../entities/sqlite/DimCustomer";
import { BridgeFilmActor } from "../entities/sqlite/BridgeFilmActor"; 
import { BridgeFilmCategory } from "../entities/sqlite/BridgeFilmCategory";
import { FactRental } from "../entities/sqlite/FactRental";
 import { FactPayment } from "../entities/sqlite/FactPayment";

export const SqliteDS = new DataSource({
  type: "sqlite",
  database:  "analytics.db",
  entities: [SyncState, DimDate, DimFilm,
     DimActor, DimCategory, DimStore, DimCustomer, BridgeFilmActor,
      BridgeFilmCategory, FactRental, FactPayment],

  synchronize: true,
  logging: false,
});