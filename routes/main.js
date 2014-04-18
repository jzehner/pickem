var User = require('../models/user.js');


module.exports = function(app, passport){

    
    
    app.get('/', function(req, res) {
        res.render('index.ejs', { locals: { authMessage: passport.getAuthStatus(req), pagedata: passport.getPageData(req) }}); 
    });
    
    app.get('/home', passport.isLoggedIn, function(req, res){
        res.render('home.ejs', { locals: { authMessage: passport.getAuthStatus(req), pagedata: passport.getPageData(req) }});
    });
    

    
    app.get('/edit', passport.isLoggedIn, function(req, res){
        res.render('edit.ejs', { locals: { authMessage: passport.getAuthStatus(req), pagedata: passport.getPageData(req) }}); 
    });
    
    app.post('/edit', passport.isLoggedIn, function(req, res){
        
        console.log(req.body);
        User.findById(req.user._id, function(err, user){
            if(!user){
            }
            else{
                
                user.firstname = req.body.firstname;
                user.lastname = req.body.lastname;
                user.nickname = req.body.nickname;
                user.phone = req.body.phone;
                user.smsenabled = req.body.smsenabled;
                user.modified = Date.now();
                
                user.save(function(err) {
                    if(err)
                        console.log(err);
                    else
                        console.log('Updated user ' + req.user._id);
                });
                
            }
        });
        
        res.redirect('/home');
    });
    
    app.use(function(err, req, res, next){
        res.render('500.ejs', { locals: { 
            authMessage: passport.getAuthStatus(req), 
            pagedata: passport.getPageData(req) }});
        console.error(err);        
    });
    
    app.use(function(req, res, next){
        res.render('404.ejs', { locals: { 
            authMessage: passport.getAuthStatus(req), 
            pagedata: passport.getPageData(req) }});
    });
}

function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated()){
           
		return next();
    }
	// if they aren't redirect them to the home page
	res.redirect('/login');
}

/*function getAuthStatus(req){
    if(req.isAuthenticated()){ return 1; }
    else { return 0; }
}

function getPageData(req){
    var data = new Object;
    if(req.user != undefined){
        data.user = req.user;
    }
    return data;
    
}*/

