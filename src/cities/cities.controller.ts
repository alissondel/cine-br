import {
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UsePipes,
  Controller,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from 'src/users/enum/user-type.enum';
import { UserId } from 'src/decorators/user-id-decorator';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Get(':id')
  async state(@Param('id') id: string) {
    return await this.citiesService.findOne(+id);
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
    @Query('status') status: boolean,
  ) {
    limit = limit > 100 ? 100 : limit;
    return await this.citiesService.findAll(
      { page, limit },
      order,
      id,
      name,
      status,
    );
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Post()
  async create(@UserId() userId: number, @Body() data: CreateCityDto) {
    return await this.citiesService.create(userId, data);
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return await this.citiesService.update(+id, updateCityDto);
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.citiesService.delete(+id);
  }
}
