
var URL_MODEL = require('../models/UrlModel');
var urlModel = new URL_MODEL();
var request = require('request');
var cheerio = require('cheerio');
var common = require('../utility/common');




var CRAWLER = function() {
    var exports = {};

    var crawlerName = "";
    var urlList = [];
    var action = "stop";


    //  Crawler 初始化
    var init = exports.init = function init(crawler_name, callback) {
        console.info(" --------------------------- ");
        console.info(" (0) [Crawler][init] ");

        if (!crawler_name) {
            callback({ error: "crawler_name is undefine" });
            return;
        }

        crawlerName = crawler_name;


        if (action == "stop" && urlList.length == 0) {
            action = "start";
            start();
        }

        if (callback && action == "start") {
            console.info(" (0) [Crawler][init][process.nextTick] ");
            callback(null);
        }
    }


    var getAction = exports.getAction = function getAction() {
        return action;
    }

    //  開始
    var start = function start() {
        console.info(" (1) [Crawler][start] ");
        loadData(function() {
            console.info(" (3) [Crawler][start][result]");
            console.info(urlList);

            execute(function() {
                console.info(" (6) [Crawler][execute][finish] ");
                action = "stop";
            });
        })
    }


    //  載入資料庫未處理的資料
    var loadData = function loadData(callback) {
        console.info(" (2) [Crawler][loadData] ");

        var sql = "select * from link_manage where status in (0, 9) limit 10";   //0: 待處理, 9:request error

        urlModel.query(sql, function(rows) {
            if (rows && rows.length > 0) {
                for (var i in rows) {
                    urlList.push(rows[i]);
                }
            }

            if (callback) {
                callback()
            }
        })
    }


    // 逐筆處理
    var execute = function execute(callback) {
        console.info(" (4) [Crawler][execute] ");

        var index = 0;

        var process_callback = function() {
            if (urlList.length > 0) {
                process();
            }
            else if (urlList == 0) {
                if (callback) {
                    callback();
                }
            }
        }

        var process = function() {
            var item = urlList[0];
            urlList.shift();
            crawl(item, process_callback);
        }


        if (urlList.length > 0) {
            process();
        }

    }



    var crawl = function crawl(item, callback) {
        console.info(" (5) [Crawler][crawl]: " + item.id + " - " + item.url);


        var http_request = function(item) {
            request({
                url: item.url,
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.130 Safari/537.36'
                }
            }, function(error, response, body) {
                 console.info(" (5-1) [Crawler][crawl][response]: " + item.id );
                 if (error) {
                     updateErrorState(item);
                     console.error(" <<  crawl errors: failed to load data: " + error);
                     if (callback) {
                         callback();
                     }
                     return;
                 }
                 
                 var arrayList = [];
                 var $ = cheerio.load(response.body.toString());
                 
                 // 擷取網頁中其他的 <a> 連結
                 $('a').each(function() {
                     var uri = $(this)[0].attribs.href;
                     if (uri != undefined && uri != "") {
                         var protocol = common.getUrlProtocol(item, uri);
                         var host = common.getUrlHost(item, uri);
                         var path = common.getUrlPath(protocol, host, item, uri);
                         if (path != "" && !common.urlExist(path, arrayList)) { 
                             var new_url = {
                                 status: 0,
                                 host: host,
                                 url: path
                             }
                             arrayList.push(new_url);
                         }
                     }
                 });
                 
                 // 其他擷取邏輯 ...
                 //
                 //
                 // 其他擷取邏輯 ...
                 
                 
                 if (arrayList.length > 0) {
                     saveLink(arrayList, item.id, callback);
                 } else {
                     if (callback) {
                         callback();
                     }
                 }
                 
                 
                 
                 
                 
            })
        }
        
        
        
        var saveLink = function (arrayList, id, callback) {
            console.info(" (5-2) [Crawler][crawl][saveLink]: " + id);
            
            var save = function () {
                var item = arrayList[0];
                arrayList.shift();
                
                var sql = " INSERT INTO link_manage(status, executor, host, url, create_date, update_date ) ";
                sql += " SELECT  '0', '" + crawlerName + "' , '" + item.host + "' , '" + item.url + "', Now(), Now()  from link_manage ";
                sql += " WHERE NOT EXISTS ( ";
                sql += " SELECT * FROM link_manage ";
                sql += " WHERE url = '" + item.url + "' ) LIMIT 1";
                
                //console.log(sql)
                
                urlModel.save(sql, function(result){
                    console.log("[saveLink][result]: " + id);
                    console.log("[saveLink][result][insertId]: " + result.insertId);
                    
                    if (arrayList.length > 0) {
                        save();
                    }
                    else if(arrayList.length == 0) {
                        if (callback) {
                            callback();
                        }
                    }

                });
            }
            
            
            if (arrayList.length > 0) {
                save();
            }
        }
        
        
        var updateErrorState = function (data) {
            var sql = "update link_manage set status = 9 , update_date = Now() where id=" + data.id;
            urlModel.query(sql, function(rows) {
                
            })
        }


        var updateState = function(data) {
            // update status: 1 (crawling)
            var sql = "update link_manage set status = 1 , update_date = Now() where id=" + data.id;
            urlModel.query(sql, function(rows) {
                //console.log("[updateState][result]: ");
                //console.log(rows);
                http_request(data);
            })
     
        }


        updateState(item);
        
    }



    return exports;
}



module.exports = CRAWLER;