import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Repository } from './repository.entity';
import { Link } from './link.entity';

@Entity('architectureRef')
export class ArchitectureRef {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  urlModule: string;

  @Column()
  version: string;

  @Column()
  urlImage: string;

  @OneToMany(() => Repository, (repository) => repository.architectureRef)
  repositories: Repository[];

  @ManyToOne(() => Link, (link) => link.architectures)
  firstLink: Link;

  @Column()
  avaliable: boolean;
}
