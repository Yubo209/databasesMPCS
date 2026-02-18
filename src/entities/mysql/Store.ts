import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { Address } from "./Address";
@Entity("store")
export class Store {
  @PrimaryColumn()
  store_id!: number;
  @Column()
  manager_staff_id!: number;
  @Column()
  address_id!: number;
  @Column()
  last_update!: Date;
  @ManyToOne(() => Address)
  @JoinColumn({ name: "address_id" })
  address!: Address;
}
