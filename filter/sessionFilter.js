var sessionFilter = function (req, res, next) {
	console.log(" ==== session filter ====")
	console.log(req.session.user);
    
    // 有 session , 或 url path: /auth, /auth/login 直接通過不驗證
	if (req.session.user || req.path === '/auth' || req.path === '/auth/login') {
        next();
    } else {
		res.redirect("/auth");
    }
    
}

module.exports = sessionFilter;