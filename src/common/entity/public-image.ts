import { Entity } from 'typeorm';
import { PublicFile } from './public-file';

@Entity()
export class PublicImage extends PublicFile {
  constructor(key: string, url: string) {
    super(key, url);
  }
}
