const { Router } = require("express");
const express = require("express");
const router = express.Router();

// intro페이지 접근 라우터
router.get("/intro", function (request, response) {
    response.render("intro");
});

module.exports = router;