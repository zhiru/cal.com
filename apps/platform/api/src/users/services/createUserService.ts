import type { InsertResult } from 'kysely';

export const createUserService = async (
  {
    persistUser,
  }: { persistUser: (username: string, password: string, email: string) => Promise<InsertResult> },
  username: string,
  password: string,
  email: string,
) => {
  // some logic
  return await persistUser(username, password, email);
};
