import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Link } from './link.entity';
import { ProjectType } from './projectType.entity';

@Entity('LinkProjectType')
export class LinkProjectType {
  @PrimaryColumn()
  linkId: number;

  @PrimaryColumn()
  projectTypeId: number;

  @ManyToOne(() => Link, (link) => link.linkProjectTypes)
  link: Link;

  @ManyToOne(() => ProjectType, (projectType) => projectType.linkProjectTypes)
  projectType: ProjectType;
}
