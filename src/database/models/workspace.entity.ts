import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductWorkspace } from './productWorkspace.entity';
import { AutoMap } from '@automapper/classes';

@Entity('workspace')
export class Workspace {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column()
  @AutoMap()
  name: string;

  @Column({ nullable: true })
  @AutoMap()
  description: string;

  @Column({ nullable: true })
  @AutoMap()
  owner: string;

  @CreateDateColumn()
  @AutoMap()
  createdAt: Date;

  @Column()
  @AutoMap()
  isEcosystem: boolean;

  @OneToMany(
    () => ProductWorkspace,
    (productWorkspace) => productWorkspace.workspace,
  )
  @AutoMap()
  productWorkspaces: ProductWorkspace[];
}
