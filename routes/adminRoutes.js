const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const jwt = require('jsonwebtoken');

// Admin-only middleware
function verifyAdmin(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') return res.status(403).send('Access denied.');
        req.user = decoded;
        next();
    } catch (err) {
        return res.redirect('/login');
    }
}

router.get('/dashboard', verifyAdmin, adminController.getDashboard);
router.post('/recipe/:id/approve', verifyAdmin, adminController.approveRecipe);
router.post('/recipe/:id/reject', verifyAdmin, adminController.rejectRecipe);

router.get('/recipe/:id/edit', adminController.getEditRecipeForm);
router.post('/recipe/:id/update', adminController.updateRecipe);
router.post('/recipe/:id/delete', adminController.deleteRecipe); // for rejected only


module.exports = router;
