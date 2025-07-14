const express = require('express');
const router = express.Router();
const recipeModel = require('../models/recipeModel');

// Landing page
router.get('/', async (req, res) => {
  try {
    const recipes = await recipeModel.getApprovedRecipes();
    res.render('pages/landing', { recipes });
  } catch (error) {
    console.error('Error loading landing page:', error);
    res.render('pages/landing', { recipes: [] });
  }
});

// Single recipe view
router.get('/recipe/:id', async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = await recipeModel.getRecipeById(recipeId);

    if (!recipe) {
      return res.status(404).render('pages/404', { message: 'Recipe not found' });
    }

    res.render('pages/recipeDetails', { recipe });
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    res.status(500).send('Server error');
  }
});
module.exports = router;


