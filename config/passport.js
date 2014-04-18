var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

var User = require('../models/user');
var jwt = require('jwt-simple');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

 	

    passport.use('local-signup', new LocalStrategy({
        
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, username, password, done) {
        process.nextTick(function() {
        User.findOne({ 'username' :  username }, function(err, user) {
            if (err)
                return done(err);
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
            } else {
                var newUser = new User();
                
                newUser.username    = username;
                newUser.password = newUser.generateHash(password);
                newUser.token = jwt.encode({username: username},'CantWeAllJustGetAlong');
                newUser.created = Date.now();
                
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));
    
    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, username, password, done) { 
        User.findOne({ 'username' :  username }, function(err, user) {
            if (err)
                return done(err);
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); 
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); 
            return done(null, user);
        });

    }));
    
    passport.use('local-rest-signup', new LocalStrategy(
        {
            usernameField: 'username',
            passwordField : 'password',
            passReqToCallback: true
        },
        function(req, username, password, done) {
            process.nextTick(function() {
                console.info("username: " + username);
                User.findOne({ 'username' :  username }, function(err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, false, { message: 'That username is already taken.'});
                    } else {
                        var newUser = new User();

                        newUser.username    = username;
                        newUser.password = newUser.generateHash(password);
                        newUser.token = jwt.encode({username: username},'CantWeAllJustGetAlong');
                        newUser.created = Date.now();

                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }
    ));
        
    passport.use('local-rest-login', new LocalStrategy(
        {
            usernameField: 'username',
            passwordField : 'password',
            passReqToCallback: true
        },
        function(req, username, password, done) { 
            console.info("username: " + username);
            User.findOne({ 'username' :  username }, function(err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, { message: 'No user found.'}); 
                if (!user.validPassword(password))
                    return done(null, false, { message: 'Oops! Wrong password.'}); 
                return done(null, user);
            });
        }
    ));

    
    passport.use('bearer', new BearerStrategy({   
        },
        function(token, done) {
            console.log('Token - ' + token);
            
            User.findOne({ 'token' : token }, function(err, user){
                if(err) { 
                    console.log('Could not find user with token ' + token);
                    return done(err); 
                }
                if(!user) {
                    console.log('Could not find user with token ' + token);
                    return done(null, false); 
                }
                console.log('Found user: ' + user.username);
                return done(null, user);
            });
            
        }
    ));
    
    passport.isLoggedIn = function(req, res, next){

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated()){

            return next();
        }
        // if they aren't redirect them to the home page
        res.redirect('/login');
    }
    
    passport.getAuthStatus = function(req){
        if(req.isAuthenticated()){ return 1; }
        else { return 0; }
    }
    
    passport.getPageData = function(req){
        var data = new Object;
        if(req.user != undefined){
            data.user = req.user;
        }
        return data;

    }
};

