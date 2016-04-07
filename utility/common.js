var COMMON = function () {
    var exports = {};

    var getUrlProtocol = exports.getUrlProtocol = function getUrlProtocol(data, uri) {
        var protocol = "http";
        if (uri != undefined) {
            if (uri.indexOf("http") == -1) {
                // query oriurl
                if (data.url.indexOf("https") > -1)
                    protocol = "https";
            } else {
                if (uri.indexOf("https") > -1)
                    protocol = "https";
            }
        }
        return protocol;
    };
    
    

    var getUrlHost = exports.getUrlHost = function getUrlHost(data, uri) {
        var host = "";
        if (uri.indexOf("http") > -1) {
            var a = uri.split("//")[1];
            host = a.split("/")[0];
        } else {
            var b = data.url.split("//")[1];
            host = b.split("/")[0];
        }
        return host;
    };



    var getUrlPath= exports.getUrlPath =function getUrlPath(protocol, host, data, uri) {
        var path = "";
        if (uri.indexOf("http") > -1) {
            path = uri;
        } else {
            var x = uri.substring(0, 1);
            if (x == "#" || x == "") {
                path = "";
            } else if (x == "/") {
                path = protocol + "://" + host + uri;
            }
        }
        return path;
    };



    var getDateTime = exports.getDateTime = function getDateTime() {
        var dt = new Date();
        return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate() + " " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds()
    };
    
    
    
    
    var urlExist = exports.urlExist = function urlExist(url, list) {
        var exist = false;
        for (var i = 0; i < list.length; i++) {
            if (url == list[i].url) {
                exist = true;
                break;
            };
        };
        return exist;
    };



    return exports;
}



module.exports = new COMMON();