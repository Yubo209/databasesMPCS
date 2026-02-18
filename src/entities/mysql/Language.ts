import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "language" })
export class Language {

  @PrimaryGeneratedColumn({ type: "integer" })
  language_id!: number;

  @Column({ type: "text" })
  name!: string;

}
