import Post from "../models/Post.js";
import { validationResult } from "express-validator";

export const getAll = async (req, res) => {
  try {
    const posts = await Post.find({}).populate("user").exec();
    // here we conntect link(using populate) with user document. to get user object with id
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Could not create post",
    });
  }
};
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    // this params.id we take out from request app.get("/posts/:id"). for sample,
    // if here will be "/posts/:test" we goona write req.params.test
    Post.findOneAndUpdate(
      {
        // searching base on this id
        _id: postId,
      },
      {
        // here we gonna increase ammount of views
        $inc: { viewsCount: 1 },
      },
      {
        // this parametr means that we want update post and return him , like return acctuall post 1:40 video!!!
        returnDocument: "after",
      },
      //   function which gonna run , was error or came respond,
      //   what gonna happen after geting the post and update, what do else ,
      //   return error or document
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Could not return post",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "Post not found",
          });
        }
        if (doc) {
          res.json(doc);
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Could not create post",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    Post.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        // checking after remove post, is succes of error
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Could not delete post",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "Post is not found",
          });
        }
        res.json({
          success: true,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Could not create post",
    });
  }
};

export const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }
  try {
    const doc = new Post({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });
    const post = await doc.save();
    //creating document(post)
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Could not create post",
    });
  }
};
export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await Post.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags,
      }
    );
    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Could not update post",
    });
  }
};
