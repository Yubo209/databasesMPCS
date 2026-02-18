import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "actor" })
export class Actor {

  @PrimaryGeneratedColumn({ type: "integer" })
  actor_id!: number;

  @Column({ type: "text" })
  first_name!: string;

  @Column({ type: "text" })
  last_name!: string;

  @Column({ type: "datetime" })
  last_update!: Date;

}
