import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity({ name: "dim_category" })
export class DimCategory {
  @PrimaryGeneratedColumn({ type: "integer" })
  category_key!: number;
  @Index({ unique: true })
  @Column({ type: "integer" })
  category_id!: number;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text" })
  last_update!: string;
}
