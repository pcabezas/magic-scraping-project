const express = require('express');
const router = express.Router();
const { getCategories, postCategory } = require('../../../controllers/v1/categories/index');

// Categories Routes
router.get('/categories', getCategories);
router.post('/category', postCategory);

module.exports = router;