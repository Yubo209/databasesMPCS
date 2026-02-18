import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity({ name: "dim_customer" })
export class DimCustomer {
  @PrimaryGeneratedColumn({ type: "integer" })
  customer_key!: number;
  @Index({ unique: true })
  @Column({ type: "integer" })
  customer_id!: number;
  @Column({ type: "text" })
  first_name!: string;

  @Column({ type: "text" })
  last_name!: string;

  @Column({ type: "integer" })
  active!: number; // 0/1
  @Column({ type: "text" })
  city!: string;
  @Column({ type: "text" })
  country!: string;

  @Column({ type: "text" })
  last_update!: string;
}
