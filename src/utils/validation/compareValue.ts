import { compare } from 'bcrypt';

export const validate = async (
  valueOne: string,
  valueTwo: string,
): Promise<boolean> => {
  return compare(valueOne, valueTwo);
};
