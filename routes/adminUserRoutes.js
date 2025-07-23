const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  // ...controller methods
} = require('../controller/adminUserController');

// All protected
router.use(auth);

// ...define your routes

module.exports = router;
