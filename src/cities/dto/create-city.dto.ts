import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateCityDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Numero Inexistente!' })
  stateId: number;
}
