import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'src/commom/errors/types/NotFoundError';
import { encryptPassword, validatePassword } from 'src/utils/encrypt/password';
import { ValidationEmail } from 'src/utils/validation/email';
import { UpdatePasswordDto } from './dto/update-password.dto';

import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async findOne(id: number): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({
      where: {
        id,
        status: true,
      },
    });

    if (!user) {
      throw new NotFoundError(
        'Usuario Inativo ou não existe no banco de dados!',
      );
    }

    return user;
  }

  async findEmail(email: string, status?: boolean): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({
      where: {
        email,
        status,
      },
    });

    if (ValidationEmail(email) === false) {
      throw new NotFoundError('Email não é valido!');
    }

    if (!user) {
      throw new NotFoundError(
        'Usuario Inativo ou não existe no banco de dados!',
      );
    }

    return user;
  }

  async findAll(
    options: IPaginationOptions,
    order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<Pagination<UsersEntity>> {
    const queryBuilder = this.usersRepository.createQueryBuilder('u');

    queryBuilder.select([
      'u.id',
      'u.name',
      'u.email',
      'u.phone',
      'u.type_user',
      'u.cpf',
      'u.status',
    ]);
    queryBuilder.orderBy('u.id', `${order}`);

    return paginate<UsersEntity>(queryBuilder, options);
  }

  async create(data: CreateUserDto): Promise<UsersEntity> {
    const { email, password, ...rest } = data;

    const cryptPassword = await encryptPassword(password);

    const createdUserData = {
      ...rest,
      email: email.trim(),
      password: cryptPassword,
      typeUser: 1,
      createdAt: new Date(),
      createdUser: 1,
    };

    const user = await this.usersRepository.create(createdUserData);

    if (!user) throw new Error('Faltando campos preenchidos!');

    return this.usersRepository.save(user);
  }

  async update(id: number, data: UpdateUserDto): Promise<UsersEntity> {
    const userOld = await this.findOne(id);

    return await this.usersRepository.save({
      ...userOld,
      ...data,
    });
  }

  async updatePassword(userId: number, data: UpdatePasswordDto) {
    const user = await this.findOne(userId);

    const cryptNewPassword = await encryptPassword(data.newPassword);
    const isMatch = await validatePassword(data.password, user.password);

    if (!isMatch) {
      throw new BadRequestException(
        'Senha alterada, por favor verificar se está correta!',
      );
    }

    if (data.newPassword !== data.confirmNewPassword) {
      throw new NotFoundError(
        'Nova senha e Confirmar nova senha estão diferentes!',
      );
    }

    return this.usersRepository.save({
      ...user,
      password: cryptNewPassword,
    });
  }

  async delete(id: number): Promise<UsersEntity> {
    const user = await this.findOne(id);

    const data = {
      deletedAt: new Date(),
      updatedAt: new Date(),
      deletedUser: +id,
      status: false,
    };

    return await this.usersRepository.save({
      ...user,
      ...data,
    });
  }

  async isEmailUnique(email: string): Promise<boolean> {
    const existingUserEmail = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    return !existingUserEmail;
  }

  async isCpfUnique(cpf: string): Promise<boolean> {
    const existingUserCpf = await this.usersRepository.findOne({
      where: {
        cpf,
      },
    });

    return !existingUserCpf;
  }
}
