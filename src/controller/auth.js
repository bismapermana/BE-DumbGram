const { User } = require("../../models/");
const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const data = req.body;

    const schema = joi
      .object({
        fullName: joi.string().required(),
        username: joi.string().required(),
        email: joi.string().email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        }),
        password: joi.string().min(5).required(),
      })
      .validate(data);

    if (schema.error) {
      return res.status(400).send({
        status: "error",
        message: schema.error.message,
      });
    }

    const findData = await User.findOne({
      where: { email: req.body.email },
    });

    if (findData) {
      return res.status(400).send({
        status: "error",
        message: "email has been registered",
      });
    }

    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 0);

    const createdData = await User.create({
      ...data,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: createdData.id }, process.env.SECRET_KEY);

    res.status(200).send({
      status: "success",
      users: { createdData, token },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      message: "server error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const schema = joi
      .object({
        email: joi
          .string()
          .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
        password: joi.string().min(5).required(),
      })
      .validate(req.body);

    if (schema.error) {
      return res.status(400).send({
        status: "error",
        message: schema.error.message,
      });
    }

    const checkEmail = await User.findOne({
      where: { email },
    });

    const checkPassword = await bcrypt.compare(password, checkEmail.password);

    if (!checkEmail || !checkPassword) {
      return res.status(400).send({
        status: "error",
        message: "email & password doesn't match",
      });
    }

    const token = jwt.sign(
      {
        id: checkEmail.id,
      },
      process.env.SECRET_KEY
    );

    res.status(200).send({
      status: "success",
      message: "successfully login",
      users: {
        email: checkEmail.email,
        email: checkEmail.status,
        token,
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
