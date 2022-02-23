const jwt = require('jsonwebtoken')
require('dotenv').load()

// Get the extension of a url/file
// Credit for regular expression - https://stackoverflow.com/a/47767860/2377343
exports.fileExtension = (url) => { return url.split('.').pop().split(/\#|\?/)[0] }

// Verify token
exports.verifyToken = (req, res, next) => {
  const { token } = req.headers
  // Return forbidden status if the token is not available
  if (!token) {
    return res.status(403).json({ authorized: false, error: 'Token is required.' })
  }
  // Verify token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) { return res.status(401).send({ authorized: false, error: 'Verification failed or token has expired.' }) }
    // No error so save decoded token into req.user and go to next process.
    req.user = decoded
    next()
  })
}