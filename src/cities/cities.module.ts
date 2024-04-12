import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitiesEntity } from './entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CitiesEntity])],
  controllers: [CitiesController],
  providers: [CitiesService],
  exports: [CitiesService],
})
export class CitiesModule {}
