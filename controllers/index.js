var express = require('express');
var router = express.Router();

// ---data---
//var UsersModel = require('../models/UsersModel.js');
//var DataModel = require('../models/DataModel.js');

// ---controller---
router.use('/auth', require('./auth'));
// router.use('/input', require('./input'));
// router.use('/dataList', require('./dataList'));




router.get('/', function(req, res, next) {
    
    console.info(" [首頁.index] ")
    /*
    if (!req.session.user) {
        res.redirect('/auth');
        return;
    }
    */


    // var cssList = [
    //     { src: "/css/index.css" }
    // ]
    // var jsList = [
    //     { src: "https://www.google.com/jsapi" },
    //     { src: "/libs/handlebars-v4.0.4.js" },
    //     { src: "/js/stores/dataStore.js" },
    //     { src: "/js/components/table_components.js" },
    //     { src: "/js/views/indexList.js" }
    // ];

    // var year = new Date().getFullYear()

    res.render('index', {
        //mainId: "home",
        //user: req.session.user,
        //cssList: cssList,
        //jsList: jsList,
        //year: year
        username: 'Vic Huang: 2016',
        title: "首頁"
    });

});

module.exports = router;

