import {
  Entity,
  PrimaryColumn,
  Column
} from "typeorm";

@Entity("inventory")
export class Inventory {

  @PrimaryColumn()
  inventory_id!: number;

  @Column()
  film_id!: number;

  @Column()
  store_id!: number;

  @Column()
  last_update!: Date;

}
