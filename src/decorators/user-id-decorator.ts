import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { authorizantionToLoginPayload } from '../utils/converter/base-64-converter';

export const UserId = createParamDecorator((_, ctx: ExecutionContext) => {
  const { authorization } = ctx.switchToHttp().getRequest().headers;
  const LoginPayload = authorizantionToLoginPayload(authorization);

  return LoginPayload?.id;
});
