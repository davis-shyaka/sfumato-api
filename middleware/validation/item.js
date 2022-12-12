const { check, validationResult } = require("express-validator");

exports.validateItemCreation = [
  check("artist")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Artist Name cannot be empty")
    .isString()
    .withMessage("This must be a real name")
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must be 3 - 20 characters"),
  check("email").normalizeEmail().isEmail().withMessage("Invalid email"),
  check("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Title cannot be empty")
    .isString()
    .withMessage("This must be a real name")
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must be 3 - 20 characters"),
  check("category")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Category cannot be empty")
    .isString()
    .withMessage("This must be a real name")
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must be 3 - 20 characters"),
  check("price")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Price cannot be empty")
    .isString()
    .withMessage("This must be a number"),
  check("size")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Size cannot be empty")
    .isString()
    .withMessage("This must be a name or number dimensions")
    .isLength({ min: 3, max: 20 })
    .withMessage("Size must be 3 - 20 characters"),
];

exports.itemValidation = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();

  const error = result[0].msg;
  res.json({ success: false, message: error });
};
