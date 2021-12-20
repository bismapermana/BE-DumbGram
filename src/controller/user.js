const { User } = require("../../models");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["updatedAt", "createdAt", "password"],
      },
    });

    res.status(200).send({
      status: "success",
      user: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      message: "server error",
    });
  }
};
