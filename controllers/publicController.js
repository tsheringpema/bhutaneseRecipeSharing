const recipeModel = require('../models/recipeModel');

exports.getLandingPage = async (req, res) => {
  try {
    const recipes = await recipeModel.getApprovedRecipes();
    res.render('landing', { recipes });
  } catch (error) {
    console.error('Error fetching approved recipes:', error);
    res.render('landing', { recipes: [] });
  }
};
