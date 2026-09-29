import { body } from "express-validator";

export const addGuardianValidation = [
  body("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Guardian email is required")
    .isEmail()
    .withMessage("Please provide a valid guardian email address"),

  body("relationship")
    .trim()
    .notEmpty()
    .withMessage("Relationship is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Relationship must be between 2 and 50 characters"),

  body("permissions")
    .optional()
    .isArray()
    .withMessage("Permissions must be an array"),

  body("permissions.*")
    .optional()
    .isIn(["VIEW_VAULT", "RECEIVE_RELEASE", "VERIFY_EMERGENCY"])
    .withMessage("Invalid guardian permission"),
];
