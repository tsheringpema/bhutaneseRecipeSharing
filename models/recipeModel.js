// models/recipeModel.js
const db = require('../config/db');

const createRecipeTable = async () => {
  try {
    await db.none(`
      CREATE TABLE IF NOT EXISTS recipes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        ingredients VARCHAR(255)NOT NULL,
        instructions VARCHAR(255) NOT NULL,
        image_url TEXT,
        status VARCHAR(50) DEFAULT 'pending', -- approved, rejected
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Recipe table created!');
  } catch (error) {
    console.error('Error creating recipe table:', error);
  }
};

// CRUD operations
const addRecipe = async (user_id, title, ingredients, instructions, image_url) => {
  return db.none(
    'INSERT INTO recipes(user_id, title, ingredients, instructions, image_url) VALUES($1, $2, $3, $4, $5)',
    [user_id, title, ingredients, instructions, image_url]
  );
};

const getUserRecipes = async (user_id) => {
  return db.any('SELECT * FROM recipes WHERE user_id = $1 ORDER BY created_at DESC', [user_id]);
};

const getRecipeById = async (id) => {
  return db.one(
    `SELECT recipes.*, users.name AS user_name
     FROM recipes
     JOIN users ON recipes.user_id = users.id
     WHERE recipes.id = $1`,
    [id]
  );
};

const updateRecipe = async (id, title, ingredients, instructions, image_url) => {
  return db.none(
    `UPDATE recipes SET title=$1, ingredients=$2, instructions=$3, image_url=$4 WHERE id=$5`,
    [title, ingredients, instructions, image_url, id]
  );
};

// Admin: Get all recipes
const getAllRecipes = async () => {
  return db.any(`SELECT recipes.*, users.name AS user_name, users.email AS user_email 
                 FROM recipes 
                 JOIN users ON recipes.user_id = users.id
                 ORDER BY recipes.created_at DESC`);
};

// Admin: Approve or Reject
const updateRecipeStatus = async (recipeId, status) => {
  return db.none('UPDATE recipes SET status = $1 WHERE id = $2', [status, recipeId]);
};

// for the landing page
const getApprovedRecipes = async () => {
  return db.any(`SELECT * FROM recipes WHERE status = 'approved' ORDER BY created_at DESC`);
};

const deleteRecipeById = async (id) => {
  const query = 'DELETE FROM recipes WHERE id = $1';
  return db.none(query, [id]);
};


module.exports = {
    createRecipeTable,
    addRecipe,
    getUserRecipes,
    getRecipeById,
    updateRecipe, 
    getAllRecipes,
    updateRecipeStatus,
    getApprovedRecipes, 
    deleteRecipeById
};
