import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity({ name: "dim_film" })
export class DimFilm {
  @PrimaryGeneratedColumn({ type: "integer" })
  film_key!: number;

  @Index({ unique: true })
  @Column({ type: "integer" })
  film_id!: number;

  @Column({ type: "text" })
  title!: string;

  @Column({ type: "text" })
  rating!: string;

  @Column({ type: "integer" })
  length!: number;

  @Column({ type: "text" })
  language!: string;

  @Column({ type: "integer" })
  release_year!: number;

  @Column({ type: "text" })
  last_update!: string; 
}
