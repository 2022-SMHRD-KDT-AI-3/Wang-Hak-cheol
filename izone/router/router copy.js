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

router.get("/join", function (request, response) {

    response.render("join");

});

router.post("/join", function (request, response) {
    let id = request.body.id;
    let pw = request.body.pw;
    let org = request.body.org;
    let address = request.body.address;
    let name = request.body.name;
    let tel = request.body.tel;
    let classification = request.body.classification;
    let credit = request.body.credit;

    let sql = "insert into user_info values(?,?,?,?,?,?,?,?,now())";
    conn.query(sql, [id, pw, org, address, tel, name, classification, credit], function (err, rows) {

        if (rows) {
            console.log("가입 완료");
            response.redirect("http://127.0.0.1:3307/intro");
        } else {
            console.log(err);
        }
    });
});

router.post("/login", function (request, response) {
    let id = request.body.id;
    let pw = request.body.pw;

    let sql = "select * from user_info where id = ? and pw = ?";
    conn.query(sql, [id, pw], function (err, rows) {
        console.log("로그인 성공");
        console.log(rows.length);
        if (rows.length > 0) {
            request.session.user = {
                "name": rows[0].user_name,
                "org": rows[0].org,
                "class": rows[0].classification,
                "credit": rows[0].credit
            }
            if (rows[0].classification == 'e'){
                response.redirect("/expert"); //전문가 페이지 접근
            }else{
                response.redirect("/dcCenter"); //어린이집 페이지 접근
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

// 전문가페이지 사건조회
router.get("/inquiry", function (request, response) {
    response.render("violence_inquiry");
});

module.exports = router;