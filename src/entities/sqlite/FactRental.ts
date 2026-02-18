import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity("fact_rental")
@Index(["rental_id"], { unique: true })
export class FactRental {

  @PrimaryGeneratedColumn()
  fact_rental_key!: number;

  @Column({ type: "integer" })
  rental_id!: number;

  @Column({ type: "integer" })
  date_key_rented!: number;

  @Column({ type: "integer", nullable: true })
  date_key_returned!: number | null;

  @Column({ type: "integer", nullable: true })
  film_key!: number | null;

  @Column({ type: "integer", nullable: true })
  store_key!: number | null;

  @Column({ type: "integer", nullable: true })
  customer_key!: number | null;

  @Column({ type: "integer" })
  staff_id!: number;

  @Column({ type: "integer" })
  rental_duration_days!: number;

}
