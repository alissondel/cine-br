import { compare, hash } from 'bcrypt';

export function encryptPassword(password: string): Promise<string> {
  const saltOrRounds = 10;
  return hash(password, saltOrRounds);
}

export const validatePassword = async (
  password: string,
  passwordHashed: string,
): Promise<boolean> => {
  return compare(password, passwordHashed);
};
