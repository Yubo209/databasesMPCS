import {
  Entity,
  PrimaryColumn,
  Column
} from "typeorm";

@Entity("country")
export class Country {

  @PrimaryColumn()
  country_id!: number;

  @Column()
  country!: string;

}
