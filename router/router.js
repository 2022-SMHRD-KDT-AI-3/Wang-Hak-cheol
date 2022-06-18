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

// 전문가페이지 접근 라우터
router.get("/expert", function (request, response) {

    response.render("expert_intro",{
        user: request.session.user
    });
});

// 어린이집페이지 접근 라우터
router.get("/dcCenter", function (request, response) {

    response.render("dcCenter_intro",{
        user: request.session.user
    });
});

router.get("/join", function (request, response) {

    response.render("join");

});

// 회원가입 라우터
router.post("/join", function (request, response) {
    let id = request.body.id;
    let pw = request.body.pw;
    let org = request.body.org;
    let address = request.body.address;
    let name = request.body.name;
    let tel = request.body.tel;
    let classification = request.body.classification;
    let charge_id = request.body.charge_id;
    let credit = request.body.credit;

    if (charge_id == null) {
        let sql = "insert into expert_info values(?,?,?,?,?,?,?,?,now())";
        conn.query(sql, [id, pw, org, address, tel, name, classification, credit], function (err, rows) {
            if (rows) {
                console.log("가입완료e");
                response.redirect("http://127.0.0.1:3307/intro");
            } else {
                console.log(err);
            }
        });
    
    } else {
        let sql = "insert into dc_info values(?,?,?,?,?,?,?,?,?,now())";
        conn.query(sql, [id, pw, charge_id, org, address, tel, name, classification, credit], function (err, rows) {
            if (rows) {
                console.log("가입완료c");
                response.redirect("http://127.0.0.1:3307/intro");
            } else {
                console.log(err);
            }
        });
    }
});

// 로그인 라우터(전문가, 어린이집 분기)
router.post("/login", function (request, response) {
    let id = request.body.id;
    let pw = request.body.pw;
    let classification = request.body.classification;

    if (classification == 'e') {

        let sql = "select * from expert_info where expert_id = ? and epw = ?";
        conn.query(sql, [id, pw], function (err, rows) {
            console.log("로그인 성공e");
            console.log(rows.length);
            if (rows.length > 0) {
                request.session.user = {
                    "org_name": rows[0].org_name,
                    "org_address": rows[0].org_address,
                    "org_tel": rows[0].org_tel,
                    "expert_name": rows[0].expert_name
                }
                response.redirect("/expert"); //전문가 페이지 접근

            } else {
                console.log("로그인 실패");
            };
        });

    } else {
        count = 0
        let sql = "select * from dc_info where dc_id = ? and pw = ?";
        conn.query(sql, [id, pw], function (err, rows) {
            console.log("로그인 성공c");
            console.log(rows.length);
            if (rows.length > 0) {
                request.session.user = {
                    "charge_id": rows[0].charge_id,
                    "dc_name": rows[0].dc_name,
                    "dc_address": rows[0].dc_address,
                    "dc_tel": rows[0].dc_tel,
                    "name": rows[0].user_name
                }
                // let sql = "select dcv_id, mv_no, op_no from dc_video d, model_video m, expert_opinion e where d.video_no = m.v_noand m.mv_no = e.emv_no;";
                // conn.query(sql, [], function (err, rows) {
                //     console.log("값 불러와지나?");
                //     console.log(rows.length);
                //     if (rows!=0) {
                //         request.session.dcop = {
                //             "count": rows.length
                //         }
                //     }
                // });
                response.redirect("/dcCenter"); //어린이집 페이지 접근
                
            } else {
                console.log("로그인 실패");
            }
        });
    };
});

router.get("/logout", function (request, response) {
    delete request.session.user;
    response.redirect("http://127.0.0.1:3307/intro");
});

// 전문가페이지 사건조회
router.get("/inquiry", function (request, response) {
    response.render("violence_inquiry");
});

module.exports = router;