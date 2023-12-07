const express = require("express");
const router = express.Router();
const tagsController = require("../controllers/tags");

router.post("/", tagsController.store);

// router.get("/:slug", tagsController.show);

// router.get("/", tagsController.showAll);

// router.put("/:slug",tagsController.update);

// router.delete("/:slug",tagsController.destroy);


module.exports = router;