import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Variable } from './variable.entity';
import { Link } from './link.entity';
@Entity('varFile')
export class VarFile {
  @PrimaryColumn()
  id: number;

  @Column()
  file: string;

  @Column()
  isInput: boolean;

  @Column({ nullable: true })
  enviroment: string;

  @OneToMany(() => Variable, (variable) => variable.varFile)
  variables: Variable[];

  @ManyToOne(() => Link, (link) => link.varFiles)
  link: Link;
}
