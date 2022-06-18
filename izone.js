const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const router = require('./router/router.js');
const ejs = require('ejs');
const path = require("path");
const session = require('express-session');
const session_mysql_save = require('express-mysql-session');

let DB_info = {
    host: 'project-db-stu.ddns.net', //project-db-stu.ddns.net
    user: 'CCTV',
    port: '3307',
    database: 'CCTV',
    password: '0623'
}

let session_info = new session_mysql_save(DB_info);

app.set(path.join(__dirname, '/views'));
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(
  cookieParser(process.env.COOKIE_SECRET, { sameSite: "none", secure: true })
);

app.set("view engine","ejs")
app.use(session({
    secret : "smart",
    resave : false,
    saveUninitialized : true,
    store : session_info
}))

app.use(bodyparser.urlencoded({extended:false}));
app.use(router);
app.listen(3307);