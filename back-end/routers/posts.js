const express = require("express");
const router = express.Router();
//controllers
const postsController = require("../controllers/posts");
//middlewares
const authHandlerMiddleware = require("../middlewares/authHandler");
const userIdHandlerMiddleware = require("../middlewares/userIdHandler");


router.post("/", postsController.store);

router.get("/:slug", postsController.show);

router.get("/", postsController.showAll);

router.put("/:slug", authHandlerMiddleware, userIdHandlerMiddleware, postsController.update);

router.delete("/:slug", authHandlerMiddleware, userIdHandlerMiddleware, postsController.destroy);


module.exports = router;