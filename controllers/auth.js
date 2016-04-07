var express = require('express');
var router = express.Router();
var UsersModel = require('../models/UsersModel.js');    


//router.use('/index', require('./index'));

/******************
 * 登入頁面
 * ***************/
router.get('/', function (req, res) {

    if (req.session.user) {
        res.redirect('/');
        return;
    }

    var jsList = [{ src: "/js/views/authentication.js" }];
    res.render('auth', { 
        jsList: jsList ,
        title: "登入頁",
        message: "請登入帳號密碼"
    });
});


/******************
 * [POST] 登入
 * ***************/
router.post('/login', function (req, res, next) {
    console.log(" ---- auth/login ----")
    console.log(" username: " + req.body.username)
    console.log(" password: " + req.body.password)
    
    if (req.body.password != undefined) {
        console.log(" password decode: " + new Buffer(req.body.password, 'base64').toString('binary'))
        req.body.password = new Buffer(req.body.password, 'base64').toString('binary')
    }

    if (req.session.user) {
        res.redirect('/');
        return;
    }

    if (!req.body.username || !req.body.password) {
        res.json({ success: 'ok', is_login: false, status: 990, msg: "username or password not empty." })
    }
    else {
        var UsersStore = new UsersModel();
        var params = {
            username: req.body.username,
            password: req.body.password
        }
        UsersStore.login(params, function (result) {
            if (!result) {
                res.json({ success: 'ok', is_login: false, status: 991, msg: "login fail." })
            }
            else {
                console.log(" ---- UsersStore.login ----")
                var data = {
                    id: result.id,
                    sessionToken: result._sessionToken,
                    user_name: result.get("username"),
                    email: result.get("email")
                }
                req.session.user = data;
                res.json({ success: 'ok', is_login: true, status: 100, msg: "login success.", user: data })
            }
        })
    }
});



module.exports = router;