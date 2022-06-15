const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const router = require('./router/router.js');
const ejs = require('ejs');
const session = require('express-session');
const session_mysql_save = require('express-mysql-session');

let DB_info = {
    host: 'project-db-stu.ddns.net',
    user: 'CCTV',
    password: '0623',
    port: '3307',
    database: 'CCTV'
}

let session_info = new session_mysql_save(DB_info);

app.set("view engine","ejs")
app.use(session({
    secret : "smart",
    resave : false,
    saveUninitialized : true,
    store : session_info
}))

app.use(bodyparser.urlencoded({extended:false}));
app.use(router);
app.listen(3000);