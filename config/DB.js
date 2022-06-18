const mysql = require("mysql");

let conn = mysql.createConnection({
    host: 'project-db-stu.ddns.net',
    user: 'CCTV',
    password: '0623',
    port: '3307',
    database: 'CCTV',
    multipleStatements: true
});

conn.connect();
module.exports = conn;