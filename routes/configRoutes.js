// configRoutes.js

const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');
const {cadastrarFilial, cadastrarTime} = require("../controllers/configController")

router.post('/cadloja', isAuthenticated, cadastrarFilial);
router.post('/cadtime', isAuthenticated, cadastrarTime);
module.exports = router;
