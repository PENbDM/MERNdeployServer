import { response } from "express";
import jwt from "jsonwebtoken";
export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  //   we did replace to get rid of the word Bearer in respons
  if (token) {
    try {
      // if token exist, then we have to encoded him, using jwt.verify
      // we passing there token itself and key
      const decoded = jwt.verify(token, "secret123");
      //   if we could encoded token, then passing him to req.userId
      req.userId = decoded._id;
      // IMPORTANT, after we gonna use this req.userId, for creating post,
      // so before creating post, this file will be middleware and our request
      // gonna store this req.userId. id of current user.
      // so when user will make post , we will take this user id from here and post will
      // store id of current user
      // 1.27 on video guide
      next();
    } catch (err) {
      return res.status(403).json({
        message: "No access",
      });
    }
  } else {
    return res.status(403).json({
      message: "No access",
    });
  }

  //   this is middleware function, which runing in middle of request,
  //   using next() we can jump to next part
};
