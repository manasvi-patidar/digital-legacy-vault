import { body } from "express-validator";

export const createAssetValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Asset title is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Asset title must be between 2 and 100 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("assetType")
    .notEmpty()
    .withMessage("Asset type is required")
    .isIn([
      "DOCUMENT",
      "FINANCIAL",
      "CRYPTO",
      "SOCIAL_MEDIA",
      "EMAIL",
      "SUBSCRIPTION",
      "OTHER",
    ])
    .withMessage("Invalid asset type"),

  body("metadata")
    .optional()
    .isObject({ strict: true })
    .withMessage("Metadata must be an object"),
];
