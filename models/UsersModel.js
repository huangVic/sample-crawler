var db = require('../config/parse-db');

var USERS = function USERS() {
    var exports = {}
    
    // 判斷 Session
    var currentUser = exports.currentUser = function currentUser(callback) {
        var currentUser = DB.User.current();
        if (currentUser) {
            console.log("currentUser is : ")
            console.log(currentUser)
        }

        if (callback) {
            callback(currentUser)
        }
    }
    
    
    
    // 執行 DB 登入
    var login = exports.login = function login(data, callback) {
        
         DB.User.logIn(data.username, data.password)
           .then(function (result) {
               console.log("[DB][username]: " + result.get("username"));
               console.log("[DB][email]: " + result.get("email"));
               console.log("[DB][id]: " + result.id);
               console.log("[DB][sessionToken]: " + result._sessionToken);
               callback(result)
           }, function (error) {
               console.log("[DB][login fail]: ");
               console.log(error);
               callback(null);
           });
        /*** Parse 登入代碼 
        DB.User.logIn(data.username, data.password, {
            success: function (user) {
                console.log("[Parse][username]: " + user.get("username"));
                console.log("[Parse][email]: " + user.get("email"));
                console.log("[Parse][id]: " + user.id);
                callback(user)
            },
            error: function (user, error) {
                console.log("[Parse][login fail]: ");
                console.log("error code: " + error.code);
                console.log("error message: " + error.message);
                callback(null)
            }
        });
        ***/
    }
   

    return exports;
};





module.exports = USERS;