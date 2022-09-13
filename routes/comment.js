const express = require("express");
const router = express.Router()

const CommentController = require("../controllers/CommentController");

router.post("/reviews/leave_review", CommentController.leave_review);
router.post("/reviews/leave_reply", CommentController.leave_reply);

module.exports = router;
