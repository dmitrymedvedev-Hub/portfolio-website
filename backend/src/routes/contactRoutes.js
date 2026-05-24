const express = require('express');
const { submitContact, getContacts } = require('../controllers/contactController');

const router = express.Router();

router.post('/submit', submitContact);
router.get('/all', getContacts);

module.exports = router;