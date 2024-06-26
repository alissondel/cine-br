import { CitiesEntity } from 'src/cities/entities/city.entity';
import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'state' })
export class StatesEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ name: 'abbreviation', nullable: false })
  abbreviation: string;

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

  @OneToMany(() => CitiesEntity, (city) => city.state)
  cities?: CitiesEntity[];
}
