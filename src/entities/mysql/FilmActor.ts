import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity({ name: "film_actor" })
export class FilmActor {

  @PrimaryColumn({ type: "integer" })
  film_id!: number;
  @PrimaryColumn({ type: "integer" })
  actor_id!: number;

}
