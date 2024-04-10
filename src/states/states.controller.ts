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
import { StatesService } from './states.service';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { UserId } from 'src/decorators/user-id-decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from 'src/users/enum/user-type.enum';

@Controller('states')
export class StatesController {
  constructor(private readonly statesService: StatesService) {}

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Get(':id')
  state(@Param('id') id: string) {
    return this.statesService.findOne(+id);
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Get()
  async states(
    @Query('page') page = 1,
    @Query('limit') limit = 100,
    @Query('order') order: 'ASC' | 'DESC',
    @Query('id') id: number,
    @Query('name') name: string,
    @Query('abbreviation') abbreviation: string,
    @Query('status') status: boolean,
  ) {
    limit = limit > 100 ? 100 : limit;
    return await this.statesService.findAll(
      { page, limit },
      order,
      id,
      name,
      abbreviation,
      status,
    );
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Post()
  async create(@UserId() userId: number, @Body() data: CreateStateDto) {
    return await this.statesService.create(userId, data);
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Put(':id')
  async update(
    @UserId() userId: number,
    @Param('id') id: string,
    @Body() data: UpdateStateDto,
  ) {
    return await this.statesService.update(userId, +id, data);
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Delete(':id')
  async remove(@UserId() userId: number, @Param('id') id: string) {
    return await this.statesService.delete(userId, +id);
  }
}
