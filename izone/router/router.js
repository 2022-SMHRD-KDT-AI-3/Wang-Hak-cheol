const { Router } = require("express");
const express = require("express");
const expressMysqlSession = require("express-mysql-session");
var path = require('path');
var bodyParser = require('body-parser');
const router = express.Router();
const conn = require("../config/DB.js");

// intro페이지 접근 라우터
router.get("/intro", function (request, response) {
 
    response.render("intro",{
        user: request.session.user
    });
});

router.get("/expert", function (request, response) {

    response.render("expert_intro",{
        user: request.session.user
    });
});

router.get("/dcCenter", function (request, response) {

    response.render("dcCenter_intro",{
        user: request.session.user
    });
});

router.post("/login", function (request, response) {
    let id = request.body.id;
    let pw = request.body.pw;

    let sql = "select * from user_info where user_id = ? and pw = ?";
    conn.query(sql, [id, pw], function (err, rows) {
        console.log("로그인 성공");
        console.log(rows.length);
        if (rows.length > 0) {
            request.session.user = {
                "name": rows[0].name,
                "org": rows[0].org,
                "class": rows[0].class
            }
            console.log(rows[0].class)
            if (rows[0].class == 'e'){
                response.redirect("/expert"); //전문가 class 확인, 전문가 페이지 접근
            }else{
                response.redirect("/dcCenter"); //센터 class 확인, 어린이집 페이지 접근
            } 
            
        } else {
            console.log("로그인 실패");
        }
    });
})

router.get("/logout", function (request, response) {
    delete request.session.user;
    response.redirect("http://127.0.0.1:3307/intro");
});

module.exports = router;