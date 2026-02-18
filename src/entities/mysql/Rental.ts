import {
  Entity,
  PrimaryColumn,
  Column
} from "typeorm";

@Entity("rental")
export class Rental {

  @PrimaryColumn()
  rental_id!: number;

  @Column()
  rental_date!: Date;

  @Column({ nullable: true })
  return_date!: Date;

  @Column()
  inventory_id!: number;

  @Column()
  customer_id!: number;

  @Column()
  staff_id!: number;

  @Column()
  last_update!: Date;

}
