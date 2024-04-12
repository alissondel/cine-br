import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCityDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Caracteres Invalidos' })
  name?: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty({ message: 'Numero Inexistente!' })
  stateId?: number;
}
