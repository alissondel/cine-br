import { UsersEntity } from 'src/users/entities/user.entity';

export class LoginPayload {
  id: number;
  typeUser: number;

  constructor(user: UsersEntity) {
    this.id = user.id;
    this.typeUser = user.typeUser;
  }
}
