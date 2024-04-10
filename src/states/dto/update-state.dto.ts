import { IsString, MaxLength, IsOptional } from 'class-validator';

export class UpdateStateDto {
  @IsString()
  name: string;

  @IsString()
  @MaxLength(2, { message: 'Sigla não pode possuir mais que dois caracteres' })
  @IsOptional()
  abbreviation?: string;
}
