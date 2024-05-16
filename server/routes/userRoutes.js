const express = require('express');
const router = express.Router();
const { signUp, login } = require('../controllers/userController.js');
const verifyUser = require('../middlewares/verifyUser.js');

router.post('/signup', signUp);
router.post('/login', login);
router.get('/user', verifyUser, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;
