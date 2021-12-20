const { Post, User } = require("../../models");

exports.createPost = async (req, res) => {
  try {
    const { id } = req.idUser;

    const picture = process.env.PATH_FILE_POST + req.files.post[0].filename;

    const data = {
      ...req.body,
      idUser: id,
      imagePost: picture,
    };

    const posts = await Post.create(data);

    res.status(200).send({
      status: "success",
      post: { posts },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        as: "Users",
        attributes: {
          exclude: ["updatedAt", "createdAt", "password", "fullName", "email"],
        },
      },
    });

    res.status(200).send({
      status: "success",
      post: {
        posts,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      message: "server error",
    });
  }
};

exports.getPostsByToken = async (req, res) => {
  try {
    const { id } = req.idUser;

    const posts = await Post.findAll({
      where: { id },
      include: {
        model: User,
        as: "Users",
        attributes: {
          exclude: ["updatedAt", "createdAt", "password", "email", "fullName"],
        },
      },
    });

    res.status(200).send({
      status: "success",
      post: { posts },
    });
  } catch (error) {
    console.log();
    res.status(500).send({
      status: "error",
      message: "server error",
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      message: "server error",
    });
  }
};
