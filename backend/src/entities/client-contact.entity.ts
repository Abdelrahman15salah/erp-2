import { Entity, Column } from 'typeorm';

@Entity()
export class ClientContact {
  @Column()
  email: string;

  @Column()
  phone: string;
} 