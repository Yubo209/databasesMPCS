import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity({ name: "film_category" })
export class FilmCategory {
  @PrimaryColumn({ type: "integer" })
  film_id!: number;

  @PrimaryColumn({ type: "integer" })
  category_id!: number;

}
