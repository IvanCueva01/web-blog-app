import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Hashes a plaintext password.
 * @param password The plaintext password.
 * @returns A promise that resolves to the hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares a plaintext password with a hashed password.
 * @param password The plaintext password.
 * @param hashedPassword The hashed password to compare against.
 * @returns A promise that resolves to true if the passwords match, false otherwise.
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
