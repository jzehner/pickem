
module.exports = function(app, passport){

    app.get('/login', function(req, res){
        res.render('login.ejs', { locals: { message: req.flash('loginMessage'), authMessage: 0, pagedata: passport.getPageData(req)}});   
    });
    
    app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/home', 
		failureRedirect : '/login', 
		failureFlash : true 
	}));
    
    app.get('/signup', function(req, res){
        res.render('signup.ejs', { locals: { message: req.flash('signupMessage'), authMessage: 0, pagedata: passport.getPageData(req)}});
    });
    
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/home',
        failureRedirect : '/signup',
        failureFlash :  true
    }));
    
    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });
}
