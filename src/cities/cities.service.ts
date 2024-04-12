import { Injectable } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { CitiesEntity } from './entities/city.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundError } from 'src/commom/errors/types/NotFoundError';

import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(CitiesEntity)
    private readonly citiesRepository: Repository<CitiesEntity>,
  ) {}

  async findOne(id: number) {
    return `This action returns a #${id} city`;
  }

  async findAll(
    options: IPaginationOptions,
    order: 'ASC' | 'DESC' = 'ASC',
    id: number,
    name: string,
    status: boolean,
  ): Promise<Pagination<CitiesEntity>> {
    const queryBuilder = this.citiesRepository.createQueryBuilder('c');

    const city = await queryBuilder.select(['c.id', 'c.name', 'c.status']);

    id && city.andWhere('c.id = :id', { id });
    name && city.andWhere('c.name ILIKE :name', { name: `%${name}%` });
    status !== undefined && city.andWhere('c.status = :status', { status });
    order && city.orderBy('c.id', `${order}`);
    city.withDeleted();

    return paginate<CitiesEntity>(city, options);
  }

  async create(userId: number, data: CreateCityDto) {
    const createdCityData = {
      ...data,
      createdAt: new Date(),
      createdUser: userId,
    };

    const city = await this.citiesRepository.create(createdCityData);

    if (!city) throw new NotFoundError('Faltando campos preenchidos!');

    return this.citiesRepository.save(city);
  }

  async update(id: number, data: UpdateCityDto) {
    return `This action updates a #${id} city and ${data}`;
  }

  async delete(id: number) {
    return `This action removes a #${id} city`;
  }
}
