import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'src/commom/errors/types/NotFoundError';
import { encryptPassword, validatePassword } from 'src/utils/encrypt/password';
// import { validationEmail } from 'src/utils/validation/email';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async findOne(id: number, status?: boolean): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({
      where: {
        id,
        status,
      },
    });

    if (!user) {
      throw new NotFoundError(
        'Usuario Inativo ou não existe no banco de dados!',
      );
    }

    return user;
  }

  async findEmail(email: string): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundError(
        'Usuario Inativo ou não existe no banco de dados!',
      );
    }

    return user;
  }

  async findAll(): Promise<UsersEntity[]> {
    const users = await this.usersRepository.find();

    if (!users) {
      throw new NotFoundError(
        'Usuarios Inativo ou não existe no banco de dados!',
      );
    }

    return users;
  }

  async create(data: CreateUserDto): Promise<UsersEntity> {
    const { email, password, ...rest } = data;

    const cryptPassword = await encryptPassword(password);

    // const verifyEmailExists = await this.findEmail(email);

    // if (email === verifyEmailExists.email) {
    //   throw new NotFoundError('Email já cadastrado na base de dados!');
    // }

    // if (validationEmail(email)) console.log('Email valido!');
    // else throw new Error('Email não valido!');

    const createdUserData = {
      ...rest,
      email: email,
      password: cryptPassword,
      typeUser: 1,
      createdAt: new Date(),
      createdUser: 1,
    };

    const user = await this.usersRepository.create(createdUserData);

    if (!user) throw new Error('Usuário não existe!');

    return this.usersRepository.save(user);
  }

  // async update(id: number, data: UpdateUserDto): Promise<UsersEntity> {
  //   const userOld = await this.findOne(id);

  //   return await this.usersRepository.save({
  //     ...userOld,
  //     ...data,
  //   });
  // }

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
    const user = await this.findOne(id, true);

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
}
