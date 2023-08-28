import { body } from "express-validator";

export const loginValidation = [
  body("email", "Wrong type of email").isEmail(),
  body("password", "Password must be at least five symbols").isLength({
    min: 5,
  }),
];

export const registerValidation = [
  body("email", "Wrong type of email").isEmail(),
  body("password", "Password must be at least five symbols").isLength({
    min: 5,
  }),
  body("fullName", "Name must be at least 3 symbols").isLength({ min: 3 }),
  body("avatarUrl", "Wrong url, try again").optional().isURL(),
];

export const postCreateValidation = [
  body("title", "Enter title of the post").isLength({ min: 3 }).isString(),
  body("text", "Enter text of the post")
    .isLength({
      min: 10,
    })
    .isString(),
  body("tags", "Wrong type of tags (enter the array)").optional(),
  body("imageUrl", "Wrong url, try again").optional(),
];
