import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn
} from "typeorm";

import { Country } from "./Country";

@Entity("city")
export class City {

  @PrimaryColumn()
  city_id!: number;

  @Column()
  city!: string;

  @Column()
  country_id!: number;

  @ManyToOne(() => Country)
  @JoinColumn({ name: "country_id" })
  country!: Country;

}
