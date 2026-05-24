const express = require('express');
const { getProjects, getProjectById } = require('../controllers/portfolioController');

const router = express.Router();

router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);

module.exports = router;