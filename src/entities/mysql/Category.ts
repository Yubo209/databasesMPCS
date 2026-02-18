import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "category" })
export class Category {

  @PrimaryGeneratedColumn({ type: "integer" })
  category_id!: number;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "datetime" })
  last_update!: Date;

}
