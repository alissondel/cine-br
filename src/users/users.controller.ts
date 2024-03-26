import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersEntity } from './entities/user.entity';
import { ReturnUserDto } from './dto/return-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserId } from 'src/decorators/user-id-decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from './enum/user-type.enum';
import { NotFoundError } from 'src/commom/errors/types/NotFoundError';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserType.User, UserType.Root, UserType.Admin)
  @Get(':id')
  async user(@Param('id') id: string): Promise<UsersEntity> {
    return await this.usersService.findOne(+id);
  }

  @Roles(UserType.Admin)
  @Get()
  async users(
    @Query('page') page = 1,
    @Query('limit') limit = 100,
    @Query('order') order: 'ASC' | 'DESC',
  ): Promise<Pagination<ReturnUserDto>> {
    limit = limit > 100 ? 100 : limit;
    return await this.usersService.findAll({ page, limit }, order);
  }

  @Roles(UserType.User, UserType.Root, UserType.Admin)
  @Post()
  async createUser(@Body() data: CreateUserDto): Promise<UsersEntity> {
    const { email, cpf } = data;

    const isEmailUnique = await this.usersService.isEmailUnique(email);
    const isCpfUnique = await this.usersService.isCpfUnique(cpf);

    if (!isEmailUnique) throw new NotFoundError('Este e-mail já está em uso.');
    else if (!isCpfUnique) throw new NotFoundError('Este CPF já está em uso.');
    else return await this.usersService.create(data);
  }

  @Roles(UserType.User, UserType.Root, UserType.Admin)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ): Promise<UsersEntity> {
    return this.usersService.update(+id, data);
  }

  @Roles(UserType.User, UserType.Root, UserType.Admin)
  @UsePipes(ValidationPipe)
  @Put('/update-password')
  async updatePasswordUser(
    @UserId() userId: number,
    @Body() data: UpdatePasswordDto,
  ): Promise<UsersEntity> {
    return this.usersService.updatePassword(userId, data);
  }

  @Roles(UserType.User, UserType.Root, UserType.Admin)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<UsersEntity> {
    return this.usersService.delete(+id);
  }
}
