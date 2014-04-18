
module.exports = function(app, passport){
    
    app.post('/rest/login', 
        passport.authenticate('local-rest-login', {
            session: false
        }) ,
        function(req, res) {
            res.json({
                userid: req.user._id,
                token: req.user.token
            });
        }

    );
    
    app.post('/rest/signup',
        passport.authenticate('local-rest-signup', {
            failureRedirect: '/rest/error',
            session: false
        }),
        function(req, res) {
            res.json({
                userid: req.user._id
            })
        }
    );
    
    app.get('/rest/error',
        function(req, rest){
            res.json({error: req.message});    
        }
    );
    
    app.get('/rest/unauthorized',
        function(req, res){
            res.json({error: "Not Authorized"});    
        }
    );
};