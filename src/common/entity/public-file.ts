import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class PublicFile {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public key: string;

  @Column()
  public url: string;

  constructor(key: string, url: string) {
    this.key = key;
    this.url = url;
  }
}
