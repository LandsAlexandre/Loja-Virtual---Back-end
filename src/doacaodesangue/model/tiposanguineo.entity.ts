import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Entity,
} from 'typeorm';
import { Demanda } from './demanda.entity';
import { Doador } from './doador.entity';
import { TipoSanguineoEnum } from './Enum';

@Entity()
export class TipoSanguineo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  tipofator: TipoSanguineoEnum;

  @OneToMany(type => Demanda, demanda => demanda.id)
  demanda: Demanda[];

  @OneToMany(type => Doador, doador => doador.id)
  doador: Doador[];
}
