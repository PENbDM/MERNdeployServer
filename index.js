import express from "express";
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
mongoose
  .connect(
    "mongodb+srv://dimapen2002:12Dimabob122@cluster0.rnqnljn.mongodb.net/MERN-Blog"
  )
  .then(() => {
    console.log("DB OK");
  })
  .catch((err) => console.log("DB ERROR", err));

const app = express();
app.use(express.json());

app.post("/auth/register", registerValidation, register);
app.post("/auth/login", loginValidation, login);
app.get("/auth/me", checkAuth, getMe);

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postCreateValidation, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, PostController.update);
// winish at 1:50
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
// mongodb+srv://dimapen2002:12Dimabob122@cluster0.rnqnljn.mongodb.net/MERN-Blog
