import "reflect-metadata"
import { DataSource } from "typeorm"
import "dotenv/config"
import { Film } from "../entities/mysql/Film";
import { Language } from "../entities/mysql/Language";
import { Actor } from "../entities/mysql/Actor"; 
 import { Category } from "../entities/mysql/Category"; 
 import { Store } from "../entities/mysql/Store"; 
import { Customer } from "../entities/mysql/Customer"; 
 import { FilmActor } from "../entities/mysql/FilmActor";
  import { FilmCategory } from "../entities/mysql/FilmCategory"; 
  import { Rental } from "../entities/mysql/Rental";
 import { Payment } from "../entities/mysql/Payment";
import { Address } from "../entities/mysql/Address";
import { Country } from "../entities/mysql/Country";
import { City } from "../entities/mysql/City";
import { Inventory } from "../entities/mysql/Inventory";

export const MysqlDS = new DataSource({
    type: "mysql",
    host: process.env.MYSQL_HOST,
    password: process.env.MYSQL_PASSWORD,
    port :Number(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USER,
    database: process.env.MYSQL_DB,
    entities: [Film, Language, Actor,  Inventory,Category, Store,
         Customer, FilmActor, FilmCategory, Rental, Payment,Address, Country, City],
    logging: false,

})