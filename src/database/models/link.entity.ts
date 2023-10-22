import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { VarFile } from './varFile.entity';
import { ArchitectureRef } from './architectureRef.entity';
import { LinkProjectType } from './linkProjectType.entity';

@Entity('link')
export class Link {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string | null = null;

  @Column()
  head: boolean;

  @Column()
  repositoryRef: string;

  @Column({ nullable: true })
  job: string;

  @OneToMany(() => VarFile, (varFiles) => varFiles.link)
  varFiles: VarFile[];

  @OneToOne(() => Link, (link) => link.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  nextLink: Link;

  @OneToMany(
    () => ArchitectureRef,
    (ArchitectureRef) => ArchitectureRef.firstLink,
  )
  architectures: ArchitectureRef[];

  @Column()
  multiRepo: boolean;

  @Column()
  hasInceptions: boolean;

  @OneToMany(() => LinkProjectType, (linkProjectType) => linkProjectType.link)
  linkProjectTypes: LinkProjectType[];
}
