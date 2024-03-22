import { ReturnUserDto } from '../../users/dto/return-user.dto';

export interface ReturnLoginDto {
  user: ReturnUserDto;
  accessToken: string;
}
