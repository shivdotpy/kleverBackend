const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require("../middleware/auth.middleware");

router.post('/signup', userController.signup);

router.post('/signin', userController.signin);

router.use(authMiddleware)

router.put('/updateUserImage', userController.updateUserImage);

router.get('/getUserImage', userController.getUserImage)

router.put('/updateFreelancerProfile', userController.updateFreelancerProfile)

module.exports = router;
