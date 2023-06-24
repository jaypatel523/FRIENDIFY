const express = require('express');
const router = express.Router()
const { signin, signout } = require('../controllers/auth');

router.route('/api/auth/signin').post(signin);
router.route('/api/auth/signout').get(signout);


module.exports = router;