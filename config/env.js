import dotenv from 'dotenv';

dotenv.config();

const { env: e } = process;

export const envConfig = {
    // Service Configuration
    NODE_ENV: e.NODE_ENV,
    NODE_PORT: Number(e.NODE_PORT),

    // Database Configuration
    MONGO_URL: e.MONGO_ATLAS_URI,
    
    // Auth Configuration
    SALT_ROUNDS: Number(e.SALT_ROUNDS),
    AUTH_SECRET: e.AUTH_SECRET,
}