const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  try {
    const header = req.header("Authorization");

    if (!header) {
      return res.status(403).send({
        status: "error",
        message: "forbidden access!",
      });
    }

    const token = header.replace("Bearer ", "");
    const secretKey = process.env.SECRET_KEY;
    const verified = jwt.verify(token, secretKey);
    req.idUser = verified;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      message: "server error",
    });
  }
};
