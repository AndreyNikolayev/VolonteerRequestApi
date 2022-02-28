import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Role } from '../enum/role';
import { Request } from '../../request/entity/request';
import * as bcrypt from 'bcrypt';

@Entity('usr')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  private password: string;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  socialLink: string;

  @Column({ nullable: true })
  phone: string;

  @OneToMany(() => Request, (request) => request.user, {
    cascade: true,
  })
  requests: Request[];

  constructor(
    role: Role,
    email: string,
    password: string,
    name?: string,
    socialLink?: string,
    phone?: string,
  ) {
    this.role = role;
    this.password =
      password && bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    this.email = email;
    this.name = name;
    this.socialLink = socialLink;
    this.phone = phone;
  }

  public isPasswordMatched(matchPassword: string): Promise<boolean> {
    return bcrypt.compare(matchPassword, this.password);
  }
}
