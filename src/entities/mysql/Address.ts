import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn
} from "typeorm";

import { City } from "./City";

@Entity("address")
export class Address {

  @PrimaryColumn()
  address_id!: number;

  @Column()
  city_id!: number;

  @ManyToOne(() => City)
  @JoinColumn({ name: "city_id" })
  city!: City;

}
