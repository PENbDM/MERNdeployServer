import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new User({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();
    //create user in db

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );
    // //here we creating token using the jwt.sign, our token gonna store user._id,
    // becouse in our token exist id, after when i goonna uncipher token , after i can use this info to check
    // if user Auth , to understand who is user
    const { passwordHash, ...userData } = user._doc;
    //here we using disctracture to take out passwordHash from user._doc, so to make respond with out passwordHash

    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Could not registr",
    });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "User is not found",
      });
    }
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isValidPass) {
      return res.status(403).json({
        message: "Wrong login or password",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );
    // genereation token
    const { passwordHash, ...userData } = user._doc;
    //here we using disctracture to take out passwordHash from user._doc, so to make respond with out passwordHash

    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Could not login",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User is not found",
      });
    }
    const { passwordHash, ...userData } = user._doc;
    //here we using disctracture to take out passwordHash from user._doc, so to make respond with out passwordHash

    res.json({ ...userData });
  } catch (err) {
    res.status(500).json({
      message: "No access",
    });
  }
};
