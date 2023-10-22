import {
  Check,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ArchitectureRef } from './architectureRef.entity';
import { validTypeRepositories } from './validTypeRepositories';

@Entity('repository')
export class Repository {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  name: string;

  @Check(
    `"type" IN (${validTypeRepositories
      .map((type) => `'${type}'`)
      .join(', ')})`,
  )
  @Column()
  type: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  creator: string;

  @ManyToOne(() => Product, (product) => product.repositories)
  product: Product;

  @ManyToOne(
    () => ArchitectureRef,
    (architectureRef) => architectureRef.repositories,
    { nullable: true },
  )
  architectureRef: ArchitectureRef | null;
}
