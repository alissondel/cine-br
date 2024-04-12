import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { StatesEntity } from 'src/states/entities/state.entity';

@Entity('city')
export class CitiesEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'created_user', type: 'integer' })
  createdUser!: number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  updatedAt: Date;

  @Column({ name: 'updated_user', type: 'integer', nullable: true })
  updatedUser!: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date;

  @Column({ name: 'deleted_user', type: 'integer', nullable: true })
  deletedUser!: number;

  @Column({ name: 'state_id', nullable: false })
  stateId: number;

  @ManyToOne(() => StatesEntity, (state) => state.cities)
  @JoinColumn({
    name: 'state_id',
    referencedColumnName: 'id',
  })
  state: StatesEntity;
}
