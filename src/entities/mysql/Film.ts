import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "film" })
export class Film {

  @PrimaryGeneratedColumn({ type: "integer" })
  film_id!: number;

  @Column({ type: "text" })
  title!: string;

  @Column({ type: "text" })
  rating!: string;

  @Column({ type: "integer" })
  length!: number;

  @Column({ type: "integer" })
  release_year!: number;

  @Column({ type: "integer" })
  language_id!: number;

  @Column({ type: "datetime" })
  last_update!: Date;

}
