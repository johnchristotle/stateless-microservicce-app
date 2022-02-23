const { body, validationResult } = require('express-validator')
const sharp = require('sharp')
const download = require('image-downloader')
const jsonpatch = require('fast-json-patch')
const { fileExtension } = require('../middleware/customMiddleware')

const imageTypes = ['jpg', 'tif', 'gif', 'png', 'svg']

// Resize image on post.
exports.create_thumbnail_post = (req, res, next) => {
  // Save image url and extension.
  const { imageUrl } = req.body
  // Save image extension. Convert to lowercase if in caps.
  const imageUrlExt = fileExtension(imageUrl).toLowerCase()

  // If image url extension is a type of image file, proceed to resize.
  if (imageTypes.includes(imageUrlExt)) {
    // Download image and save.
    const options = {
      url: imageUrl,
      dest: './public/images/original/',
    }
    // Set location for resized images to be saved.
    const resizeFolder = './public/images/resized/'

    // Download image from the url and save in selected destination in options.
    download.image(options)
      .then(({ filename }) => {
        // Resize image to 50x50 and save to desired location.
        // Return conversion status to user.
        sharp(filename)
          .resize(50, 50)
          .toFile(`${resizeFolder}output.${imageUrlExt}`, (err) => {
            if (err) { return next(err) }
            return res.json({
              converted: true, user: req.user.username, success: 'Great! Image has been resized', thumbnail: resizeFolder,
            })
          })
      })
      .catch(() => {
        res.status(400).json({ error: 'Oops something went wrong. Kindly check your image url and try again' })
      })
  } else {
    res.status(400).json({ error: `Sorry! We only handle image files with extensions - ${[...imageTypes]}` })
  }
}

// Apply json patch to json object and return patched object.
exports.patch_json_patch = [
  // Validate input fields. Trim spaces around username
  body('jsonObject', 'JSON object must not be empty.').isLength({ min: 1 }),
  body('jsonPatchObject', 'JSON patch object must not be empty.').isLength({ min: 1 }),

  // Process the request after validating.
  (req, res, next) => {
    // Save errors from validating, if any.
    const errors = validationResult(req)

    // Check if there were errors from the form.
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // Save object-to-patch and patch-object from the request.
    const jsonObject = JSON.parse(req.body.jsonObject)
    const jsonPatchObject = JSON.parse(req.body.jsonPatchObject)

    // Save patch in new variable.
    const patchedObject = jsonpatch.applyPatch(jsonObject, jsonPatchObject).newDocument
    // res.json({user: req.user.username, patchedObject: patchedObject})
    res.json({ patchedObject })
  },
]