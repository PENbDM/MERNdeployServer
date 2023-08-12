import express from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";
import User from "./models/User.js";
import checkAuth from "./utils/checkAuth.js";
import {
  register,
  login,
  getMe,
} from "../server/controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";
mongoose
  .connect(
    "mongodb+srv://dimapen2002:12Dimabob122@cluster0.rnqnljn.mongodb.net/MERN-Blog"
  )
  .then(() => {
    console.log("DB OK");
  })
  .catch((err) => console.log("DB ERROR", err));

const app = express();

// creating Storage, where we will keep all our pictures
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    // // where we goona store our pictures, this is funct which wait for some request,file, callback
    // this funct will explain which path you should use,
    // explaing whats gonna be name of future file
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.get("/auth/me", checkAuth, getMe);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  register
);
app.post("/auth/login", loginValidation, handleValidationErrors, login);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
// middleware, if success and picture sent success, then take the picture

app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);
// winish at 1:50
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
// mongodb+srv://dimapen2002:12Dimabob122@cluster0.rnqnljn.mongodb.net/MERN-Blog
