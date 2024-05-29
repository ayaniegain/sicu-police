const express = require('express');
const router = express.Router();
const multer = require('multer');
const { signUp, login } = require('../controllers/userController.js');
const verifyUser = require('../middlewares/verifyUser.js');
const userError = require('../middlewares/userError.js');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/signup',userError, upload.single('image'), signUp);
router.post('/login',userError, login);
router.get('/user', verifyUser, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;
