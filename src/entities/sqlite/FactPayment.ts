import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity("fact_payment")
@Index(["payment_id"], { unique: true })
export class FactPayment {

  @PrimaryGeneratedColumn()
  fact_payment_key!: number;

  @Column({ type: "integer" })
  payment_id!: number;

  @Column({ type: "integer" })
  date_key_paid!: number;

  @Column({ type: "integer", nullable: true })
  customer_key!: number | null;

  @Column({ type: "integer", nullable: true })
  store_key!: number | null;

  @Column({ type: "integer" })
  staff_id!: number;

  @Column({ type: "real" })
  amount!: number;

}
