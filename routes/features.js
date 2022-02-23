const express = require('express')
const featureController = require('../controllers/featureController')
const { verifyToken } = require('../middleware/customMiddleware')

const router = express.Router()


// Route to create image thumbnail.
router.post('/create-thumbnail', verifyToken, featureController.create_thumbnail_post)

// Route to patch json objects.
router.patch('/patch-object', verifyToken, featureController.patch_json_patch)

module.exports = router