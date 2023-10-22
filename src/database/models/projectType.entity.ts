import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LinkProjectType } from './linkProjectType.entity';

@Entity('projectType')
export class ProjectType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  active: boolean;

  @Column({ nullable: true })
  pathTemplate: string;

  @Column()
  hasSonarPropierties: boolean;

  @Column()
  pathPipeline: string;

  @Column({ nullable: true })
  postfix: string;

  @OneToMany(
    () => LinkProjectType,
    (linkProjectType) => linkProjectType.projectType,
  )
  linkProjectTypes: LinkProjectType[];
}
