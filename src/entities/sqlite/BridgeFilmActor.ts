import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity({ name: "bridge_film_actor" })
export class BridgeFilmActor {
  @PrimaryColumn({ type: "integer" })
  film_key!: number;

  @PrimaryColumn({ type: "integer" })
  actor_key!: number;
}
