import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Repository } from './repository.entity';
import { ProductWorkspace } from './productWorkspace.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  teamSlug: string;

  @Column({ nullable: true })
  creator: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Repository, (repository) => repository.product)
  repositories: Repository[];

  @OneToMany(
    () => ProductWorkspace,
    (productWorkspace) => productWorkspace.product,
  )
  productWorkspaces: ProductWorkspace[];
}
