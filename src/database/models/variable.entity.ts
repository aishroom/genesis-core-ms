import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { VarFile } from './varFile.entity';

@Entity('variable')
export class Variable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  value: string | null = null;

  @ManyToOne(() => VarFile, (varFile) => varFile.variables)
  varFile: VarFile;

  @Column()
  isMultiVariable: boolean;

  @Column({ nullable: true })
  varTemplate: string;

  @Column()
  isMultiJobData: boolean;
}
