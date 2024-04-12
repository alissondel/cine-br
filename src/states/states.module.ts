import { Module } from '@nestjs/common';
import { StatesService } from './states.service';
import { StatesController } from './states.controller';
import { StatesEntity } from './entities/state.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitiesModule } from 'src/cities/cities.module';

@Module({
  imports: [TypeOrmModule.forFeature([StatesEntity]), CitiesModule],
  controllers: [StatesController],
  providers: [StatesService],
  exports: [StatesService],
})
export class StatesModule {}
