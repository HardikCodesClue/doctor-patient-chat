import User from '../models/user.model.js';

/**
 * Create a new user.
 * @param {Object} body - User data.
 * @returns {Promise<Object>} Created user object.
 */
export const createUser = async (body) => {
    const result = await User.create(body);
    return result;
};

/**
 * Check user with email.
 * @param {Object} email - User email.
 * @returns {Promise<Object>} if user available user object else null.
 */
export const getUserByEmail = async (email) => {
    const result = await User.findOne({email});
    return result;
};