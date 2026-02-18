import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity({ name: "bridge_film_category" })
export class BridgeFilmCategory {
  @PrimaryColumn({ type: "integer" })
  film_key!: number;
  @PrimaryColumn({ type: "integer" })
  category_key!: number;
}
