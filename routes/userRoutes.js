const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const jwt = require('jsonwebtoken');

// Middleware to check if user is logged in
function verifyUser(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.redirect('/login');
    }
}

router.get('/dashboard', verifyUser, userController.getDashboard);
router.get('/add-recipe', verifyUser, userController.getAddRecipe);
router.post('/add-recipe', verifyUser, userController.postAddRecipe);
router.get('/edit-recipe/:id', verifyUser, userController.getEditRecipe);
router.post('/edit-recipe/:id', verifyUser, userController.postEditRecipe);




module.exports = router;
