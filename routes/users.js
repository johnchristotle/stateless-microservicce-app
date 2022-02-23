const express = require('express')
const userController = require('../controllers/userController')

const router = express.Router()

// Login user and sign JWT
router.post('/login', userController.user_login_post)

module.exports = router