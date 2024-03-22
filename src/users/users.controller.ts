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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { UsersEntity } from './entities/user.entity';
import { ReturnUserDto } from './dto/return-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserId } from 'src/decorators/user-id-decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from './enum/user-type.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async user(@Param('id') id: string): Promise<UsersEntity> {
    return await this.usersService.findOne(+id);
  }

  @Get()
  async users(): Promise<ReturnUserDto[]> {
    return (await this.usersService.findAll()).map(
      (userEntity) => new ReturnUserDto(userEntity),
    );
  }

  @Post()
  async createUser(@Body() data: CreateUserDto): Promise<UsersEntity> {
    return await this.usersService.create(data);
  }

  // @Put(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() data: UpdateUserDto,
  // ): Promise<UsersEntity> {
  //   return this.usersService.update(+id, data);
  // }

  @Roles(UserType.User, UserType.Root, UserType.Admin)
  @UsePipes(ValidationPipe)
  @Put('/update-password')
  async updatePasswordUser(
    @UserId() userId: number,
    @Body() data: UpdatePasswordDto,
  ): Promise<UsersEntity> {
    return this.usersService.updatePassword(userId, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<UsersEntity> {
    return this.usersService.delete(+id);
  }
}
