import { User } from 'src/user/entity/user';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { RequestStatus } from '../enum/request-status';

@Entity('request')
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  unit: string;

  @Column()
  requested: number;

  @Column()
  found: number;

  @Column()
  status: RequestStatus;

  @ManyToOne(() => User, (user) => user.requests, {
    nullable: false,
    orphanedRowAction: 'delete',
  })
  user: User;

  constructor(
    name: string,
    description: string,
    unit: string,
    requested: number,
    found: number,
    user: User,
    status: RequestStatus,
  ) {
    this.name = name;
    this.description = description;
    this.unit = unit;
    this.requested = requested;
    this.found = found;
    this.user = user;
    this.status = status;
  }
}
