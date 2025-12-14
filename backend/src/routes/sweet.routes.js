const express = require('express');
const sweetController = require('../controllers/sweet.controller');
const { authenticateToken, checkAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticateToken);

// GET routes (must come before :id routes)
router.get('/', sweetController.getAll);
router.get('/search', sweetController.search);

// POST routes
router.post('/', checkAdmin, sweetController.create);
router.post('/:id/purchase', sweetController.purchase);
router.post('/:id/restock', checkAdmin, sweetController.restock);

// GET/PUT/DELETE by ID (must come last)
router.get('/:id', sweetController.getById);
router.put('/:id', checkAdmin, sweetController.update);
router.delete('/:id', checkAdmin, sweetController.remove);

module.exports = router;
