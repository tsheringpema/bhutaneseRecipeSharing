const db = require('../config/db'); 

// create a new user table if not exists 
const createUserTable = async () => {
    try {
        await db.none(` 
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                is_verified BOOLEAN DEFAULT false, 
                verification_token TEXT,
                reset_token TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('User table created!!!');
    } catch (error) {
        console.error('Error creating users table:', error);
    }
};
 
module.exports = {
    createUserTable,
}; 
