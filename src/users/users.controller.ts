import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersEntity } from './entities/user.entity';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserId } from 'src/decorators/user-id-decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from './enum/user-type.enum';
import { NotFoundError } from 'src/commom/errors/types/NotFoundError';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Get(':userId')
  async userById(@Param('userId') userId: string): Promise<UsersEntity> {
    return await this.usersService.findOne(+userId);
  }

  @Roles(UserType.Common, UserType.Root, UserType.Admin)
  @UsePipes(ValidationPipe)
  @Get('/userId')
  async user(@UserId() userId: number): Promise<UsersEntity> {
    return await this.usersService.findOne(userId);
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Get()
  async users(
    @Query('page') page = 1,
    @Query('limit') limit = 100,
    @Query('order') order: 'ASC' | 'DESC',
    @Query('id') id: number,
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('typeUser') typeUser: number,
    @Query('status') status: boolean,
  ): Promise<Pagination<UsersEntity>> {
    limit = limit > 100 ? 100 : limit;
    return await this.usersService.findAll(
      { page, limit },
      order,
      id,
      name,
      email,
      typeUser,
      status,
    );
  }

  @Post('/create-user-common')
  async createUser(@Body() data: CreateUserDto): Promise<UsersEntity> {
    const { email, cpf } = data;

    const isEmailUnique = await this.usersService.isEmailUnique(email);
    const isCpfUnique = await this.usersService.isCpfUnique(cpf);

    if (!isEmailUnique) throw new NotFoundError('Este e-mail já está em uso.');
    else if (!isCpfUnique) throw new NotFoundError('Este CPF já está em uso.');
    else return await this.usersService.createCommon(data);
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Post('/create-user-admin')
  async createAdmin(
    @UserId() userId: number,
    @Body() data: CreateUserDto,
  ): Promise<UsersEntity> {
    const { email, cpf } = data;

    const isEmailUnique = await this.usersService.isEmailUnique(email);
    const isCpfUnique = await this.usersService.isCpfUnique(cpf);

    if (!isEmailUnique) throw new NotFoundError('Este e-mail já está em uso.');
    else if (!isCpfUnique) throw new NotFoundError('Este CPF já está em uso.');
    else return await this.usersService.createAdmin(userId, data);
  }

  @Roles(UserType.Common, UserType.Root, UserType.Admin)
  @UsePipes(ValidationPipe)
  @Put('/update-user')
  async update(
    @UserId() userId: number,
    @Body() data: UpdateUserDto,
  ): Promise<UsersEntity> {
    return await this.usersService.update(userId, data);
  }

  @Roles(UserType.Common, UserType.Root, UserType.Admin)
  @UsePipes(ValidationPipe)
  @Put('/update-password')
  async updatePasswordUser(
    @UserId() userId: number,
    @Body() data: UpdatePasswordDto,
  ): Promise<UsersEntity> {
    return await this.usersService.updatePassword(userId, data);
  }

  @Roles(UserType.Common, UserType.Root, UserType.Admin)
  @UsePipes(ValidationPipe)
  @Delete('/inactivate-user')
  async delete(@UserId() userId: number): Promise<UsersEntity> {
    return await this.usersService.delete(userId);
  }
}
