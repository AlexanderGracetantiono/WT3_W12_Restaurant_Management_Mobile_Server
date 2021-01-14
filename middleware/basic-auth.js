
var mysql = require('mysql');
require('dotenv').config();
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
});
connection.connect();

module.exports = function (req, res, next) {
    // set all secured endpoints
    // check for basic auth header
    if (req.path === '/') {
        return next();
    }
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    // verify auth credentials
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // checking username and password in user service / database
    // untuk tugas praktikum, kita menggunakan query ke database (table users)
    const user = validateUser({ username, password });
    if (!user) {
        return res.status(401).json({ message: 'Invalid Authentication Credentials', detail: user });
    }else{
        req.user = user
        next();
    }
}
const validateUser = function (credential) {

    if (credential.username == "admin" && credential.password == "admin")
        return {
            "username": "admin",
            "otherdata": "admin desc as admin",
            "allowupdate": 1,
            "allowview": 1,
            "allowdelete": 1,
            "allowadd": 1,
        }
    if (credential.username == "MemberVIP" && credential.password == "member")
        return {
            "username": "MemberVIP",
            "otherdata": "member desc as member",
            "allowupdate": false
        }
}