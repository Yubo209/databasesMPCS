import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity({ name: "dim_store" })
export class DimStore {
  @PrimaryGeneratedColumn({ type: "integer" })
  store_key!: number;

  @Index({ unique: true })
  @Column({ type: "integer" })
  store_id!: number;

  @Column({ type: "text" })
  city!: string;

  @Column({ type: "text" })
  country!: string;

  @Column({ type: "text" })
  last_update!: string;
}
