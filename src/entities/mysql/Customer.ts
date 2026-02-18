import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn
} from "typeorm";

import { Address } from "./Address";

@Entity("customer")
export class Customer {

  @PrimaryColumn()
  customer_id!: number;

  @Column()
  first_name!: string;

  @Column()
  last_name!: string;

  @Column()
  active!: number;

  @Column()
  address_id!: number;

  @Column()
  last_update!: Date;

  @ManyToOne(() => Address)
  @JoinColumn({ name: "address_id" })
  address!: Address;

}

