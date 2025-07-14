const recipeModel = require('../models/recipeModel');

// GET /user/dashboard
exports.getDashboard = async (req, res) => {
    const user = req.user;
    try {
        const recipes = await recipeModel.getUserRecipes(user.id);
        res.render('user/dashboard', { user, recipes });
    } catch (error) {
        console.error('Error loading dashboard:', error);
        res.send('Something went wrong.');
    }
};

// GET /user/add-recipe
exports.getAddRecipe = (req, res) => {
    res.render('user/addRecipe', { user: req.user, message: null });
};

// POST /user/add-recipe
exports.postAddRecipe = async (req, res) => {
    const { title, ingredients, instructions, image_url } = req.body;
    const userId = req.user.id;

    try {
        await recipeModel.addRecipe(userId, title, ingredients, instructions, image_url); // image null for now
        res.redirect('/user/dashboard');
    } catch (err) {
        console.error('Error adding recipe:', err);
        //res.send('Something went wrong.');
        res.render('user/addRecipe', { user: req.user, message: 'Error submitting recipe.' });
    }
};

// GET /user/edit-recipe/:id
exports.getEditRecipe = async (req, res) => {
  const recipeId = req.params.id;
  const user = req.user;

  try {
    const recipe = await recipeModel.getRecipeById(recipeId);

    // Ensure the recipe belongs to the logged-in user
    if (recipe.user_id !== user.id) {
      return res.status(403).send('Access denied.');
    }

    res.render('user/editRecipe', { user, recipe });
  } catch (err) {
    console.error('Error loading recipe for edit:', err);
    res.send('Something went wrong.');
  }
};

exports.postEditRecipe = async (req, res) => {
  const { title, ingredients, instructions, image_url } = req.body;
  const recipeId = req.params.id;
  const userId = req.user.id;

  try {
    const recipe = await recipeModel.getRecipeById(recipeId);
    if (recipe.user_id !== userId) {
      return res.status(403).send('Access denied.');
    }

    await recipeModel.updateRecipe(recipeId, title, ingredients, instructions, image_url);
    res.redirect('/user/dashboard');
  } catch (err) {
    console.error('Error updating recipe:', err);
    res.send('Failed to update recipe.');
  }
};



