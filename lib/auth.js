import bcrypt from "bcrypt";
import { envConfig } from '../config/env.js';

/**
 * Encrypts a password using bcrypt.
 *
 * @param {string} password - The password to be encrypted.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
export const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(envConfig.SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

/**
 * Validates a password by comparing it to a hashed password.
 *
 * @param {string} password - The password to be validated.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the password is valid.
 */
export const validatePassword = async (password, hashedPassword) => {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
};
