const express = require("express");
const router = express.Router();

const { register, login } = require("../controller/auth");
const { createPost, getPosts, getPostsByToken } = require("../controller/post");
const { getUsers } = require("../controller/user");
const { auth } = require("../middleware/auth");
const { uploadFile } = require("../middleware/uploadFile");

router.post("/register", register);
router.post("/login", login);

router.get("/users", getUsers);

router.post("/post", auth, uploadFile("post"), createPost);
router.get("/posts", auth, getPosts);
router.get("/postById", auth, getPostsByToken);

module.exports = router;
