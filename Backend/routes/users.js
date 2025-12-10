const express = require('express');
const router = express.Router();

const auth = require('../middleware/Auth');
const { getUsers } = require('../controller/userController');

router.get('/', auth, getUsers);

module.exports = router;
