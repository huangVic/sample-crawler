var db = require('../config/db');


var URL_MODEL = function() {
    var exports = {};


    // db query
    var query = exports.query = function query(sql, callback) {
        db.getConnection(function(err, connection) {
            if (err) {
                console.log("[Models][URL_MODEL][query][connection error]: " + err)
            }

            if (!sql || sql == "") {
                console.log("[Models][URL_MODEL][query][error]: sql string is null")
            }

            connection.query({
                sql: sql
            }, function(err, rows, fields) {
                if (err) {
                    console.log("[Models][URL_MODEL][query][error]: " + err)
                }
                connection.release();
                //console.log("[Models][URL_MODEL][query][result]: ");
                //console.log(rows);

                var jsonString = JSON.stringify(rows);
                var result = JSON.parse(jsonString);

                callback(result);
            });
        });
    }


    // db update
    var update = exports.update = function update(sql, callback) {
        db.getConnection(function(err, connection) {
            if (err) {
                console.log("[Models][URL_MODEL][update][connection error]: " + err)
            }

            if (!sql || sql == "") {
                console.log("[Models][URL_MODEL][update][error]: sql string is null")
            }

            connection.query({
                sql: sql
            }, function(err, rows, fields) {
                if (err) {
                    console.log("[Models][URL_MODEL][update error]: " + err)
                }
                connection.release();
                //console.log("[Models][URL_MODEL][update][result]: ");
                var jsonString = JSON.stringify(rows);
                var result = JSON.parse(jsonString);

                callback(result);
            });
        });
    }


    // db insert
    var save = exports.save = function save(sql, callback) {
        db.getConnection(function(err, connection) {
            if (err) {
                console.log("[Models][URL_MODEL][save][connection error]: " + err)
            }
            
            if (!sql || sql == "") {
                console.log("[Models][URL_MODEL][save][error]: sql string is null")
            }

            connection.query(sql, function(err, rows, fields) {
                if (err) {
                    console.log("[Models][URL_MODEL][save][error]: " + err)
                }
                connection.release();
                //console.log("[Models][Links][save][result]: ");
                //console.log(rows);
                var jsonString = JSON.stringify(rows);
                var result = JSON.parse(jsonString);
                
                callback(result);
            });

        });
    }



    return exports;
}




module.exports = URL_MODEL;