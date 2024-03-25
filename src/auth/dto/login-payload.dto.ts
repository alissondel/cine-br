import { UsersEntity } from 'src/users/entities/user.entity';

export class LoginPayload {
  id: number;
  name: string;
  email: string;
  typeUser: number;

  constructor(user: UsersEntity) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.typeUser = user.typeUser;
  }
}
