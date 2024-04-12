import { Injectable } from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StatesEntity } from './entities/state.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'src/commom/errors/types/NotFoundError';

import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class StatesService {
  constructor(
    @InjectRepository(StatesEntity)
    private readonly statesRepository: Repository<StatesEntity>,
  ) {}

  async findOne(id: number): Promise<StatesEntity> {
    const state = await this.statesRepository.findOne({
      where: {
        id,
        status: true,
      },
    });

    if (!state) {
      throw new NotFoundError(
        'Estado Inativo ou não existe no banco de dados!',
      );
    }

    return state;
  }

  async findAll(
    options: IPaginationOptions,
    order: 'ASC' | 'DESC' = 'ASC',
    id: number,
    name: string,
    abbreviation: string,
    status: boolean,
  ): Promise<Pagination<StatesEntity>> {
    const queryBuilder = this.statesRepository.createQueryBuilder('s');

    const state = await queryBuilder.select(['s.id', 's.name', 's.status']);

    id && state.andWhere('s.id = :id', { id });
    name && state.andWhere('s.name ILIKE :name', { name: `%${name}%` });
    abbreviation &&
      state.andWhere('s.abbreviation ILIKE :abbreviation', {
        abbreviation: `%${abbreviation}%`,
      });
    status !== undefined && state.andWhere('s.status = :status', { status });
    order && state.orderBy('s.id', `${order}`);
    state.withDeleted();

    return paginate<StatesEntity>(state, options);
  }

  async create(userId: number, data: CreateStateDto): Promise<StatesEntity> {
    const { abbreviation, ...rest } = data;
    const findStateAbbreviation = await this.isUniqueAbbreviation(abbreviation);

    if (!findStateAbbreviation) {
      throw new NotFoundError('Sigla já existe!!');
    } else {
      const createdStateData = {
        ...rest,
        abbreviation,
        createdAt: new Date(),
        createdUser: userId,
      };

      const state = await this.statesRepository.create(createdStateData);

      if (!state) throw new NotFoundError('Faltando campos preenchidos!');

      return this.statesRepository.save(state);
    }
  }

  async update(
    userId: number,
    id: number,
    data: UpdateStateDto,
  ): Promise<StatesEntity> {
    const { abbreviation, ...rest } = data;
    const stateOld = await this.findOne(id);

    if (data.abbreviation == stateOld.abbreviation) {
      const UpdatedStateData = {
        ...rest,
        updatedAt: new Date(),
        updatedUser: userId,
      };

      return await this.statesRepository.save({
        ...stateOld,
        ...UpdatedStateData,
      });
    } else {
      const isUnique = await this.isUniqueAbbreviation(abbreviation);

      if (!isUnique) {
        throw new NotFoundError('Sigla já existe!!');
      }

      const UpdatedStateData = {
        ...rest,
        abbreviation,
        updatedAt: new Date(),
        updatedUser: userId,
      };

      return await this.statesRepository.save({
        ...stateOld,
        ...UpdatedStateData,
      });
    }
  }

  async delete(userId: number, id: number): Promise<StatesEntity> {
    const state = await this.findOne(id);

    const data = {
      deletedAt: new Date(),
      deletedUser: userId,
      status: false,
    };

    return await this.statesRepository.save({
      ...state,
      ...data,
    });
  }

  async isUniqueAbbreviation(abbreviation: string): Promise<boolean> {
    const existingState = await this.statesRepository.findOne({
      where: {
        abbreviation,
      },
    });

    return !existingState;
  }
}
