const recipeModel = require('../models/recipeModel');

// GET /admin/dashboard
exports.getDashboard = async (req, res) => {
    try {
        const recipes = await recipeModel.getAllRecipes();
        res.render('admin/dashboard', { admin: req.user, recipes });
    } catch (error) {
        console.error('Error loading admin dashboard:', error);
        res.send('Failed to load admin dashboard.');
    }
};

// POST /admin/recipe/:id/approve
exports.approveRecipe = async (req, res) => {
    const { id } = req.params;
    await recipeModel.updateRecipeStatus(id, 'approved');
    res.redirect('/admin/dashboard');
};

// POST /admin/recipe/:id/reject
exports.rejectRecipe = async (req, res) => {
    const { id } = req.params;
    await recipeModel.updateRecipeStatus(id, 'rejected');
    res.redirect('/admin/dashboard');
};

exports.getEditRecipeForm = async (req, res) => {
  const recipe = await recipeModel.getRecipeById(req.params.id);
  if (!recipe) return res.status(404).send('Recipe not found');
  res.render('admin/editRecipe', { recipe });
};

exports.updateRecipe = async (req, res) => {
  const { title, ingredients, instructions, image_url } = req.body;
  await recipeModel.updateRecipe(req.params.id, title, ingredients, instructions, image_url);
  res.redirect('/admin/dashboard');
};

exports.deleteRecipe = async (req, res) => {
  const recipeId = req.params.id;
  try {
    await recipeModel.deleteRecipeById(recipeId);
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).send('Internal Server Error');
  }
};

