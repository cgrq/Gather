// backend/utils/validation.js
const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);



  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.param] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.statusCode = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

function isValidURL(url) {
  const regex = /^https?:\/\/.*\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;
  return regex.test(url);
}

module.exports = {
  handleValidationErrors, isValidURL
};
