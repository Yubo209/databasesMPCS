import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity({ name: "dim_actor" })
export class DimActor {
  @PrimaryGeneratedColumn({ type: "integer" })
  actor_key!: number;
  @Index({ unique: true })
  @Column({ type: "integer" })
  actor_id!: number;
  @Column({ type: "text" })
  first_name!: string;
  @Column({ type: "text" })
  last_name!: string;
  @Column({ type: "text" })
  last_update!: string;
}
