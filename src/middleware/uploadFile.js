const multer = require("multer");

exports.uploadFile = (post, picture) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      switch (file.fieldname) {
        case "post":
          cb(null, "uploads/post");
          break;
        case "picture":
          cb(null, "uploads/picture");
          break;
      }
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
    },
  });

  const fileFilter = function (req, file, cb) {
    if (file.fieldname === picture || file.fieldname === post) {
      if (
        !file.originalname.match(
          /\.(jpg|JPG|jpeg|JPEG|png|PNG|git|GIF|pdf|Pdf|PDF)$/
        )
      ) {
        req.fileValidationError = {
          message: "Only image files are allowed!",
        };
        return cb(new Error("Only image files are allowed!"), false);
      }
    }
    cb(null, true);
  };

  const sizeInMb = 10;
  const maxSize = sizeInMb * 10000 * 1000;

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).fields([
    {
      name: post,
      maxCount: 1,
    },
    {
      name: picture,
      maxCount: 1,
    },
  ]);

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }

      if (!req.files && !err) {
        return res.status(400).send({
          message: "Please select files to upload",
        });
      }

      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "Max file sized 10Mb",
          });
        }
        console.log(err);
        return res.status(400).send({
          message: "failed",
          status: err,
        });
      }
      return next();
    });
  };
};
