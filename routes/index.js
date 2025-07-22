const express = require('express');
const router = express.Router();

// @route   GET api
// @desc    Test route
// @access  Public
router.get('/', (req, res) => res.send('API Running'));

module.exports = router;

