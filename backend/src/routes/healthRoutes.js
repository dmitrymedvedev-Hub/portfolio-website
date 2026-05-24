const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Portfolio API is running.' });
});

module.exports = router;