import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity({ name: "sync_state" })
export class SyncState {

  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column()
  table_name!: string;

  @Column({ type: "text" })
  last_marker!: string;

}
