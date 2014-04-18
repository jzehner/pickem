var Pool = require('../models/pool.js');
var User = require('../models/user.js');
var Pick = require('../models/pick.js');

var ObjectId = require('mongoose').Types.ObjectId;

module.exports = function(app, passport){
    
    app.get('/pool', passport.isLoggedIn, function(req, res){
        Pool.find({ 'owner': req.user._id  }, '_id name homeName visitorName', function (err, pools){
            if(!pools){
                res.render('myPools.ejs', { locals: {
                    authMessage: passport.getAuthStatus(req)
                    ,pagedata: passport.getPageData(req)
                    ,poolList: []
                }}); 
            }
            else{
                res.render('myPools.ejs', { locals: {
                    authMessage: passport.getAuthStatus(req)
                    ,pagedata: passport.getPageData(req)
                    ,poolList: pools
                }});   
            }
        });       
    });
    
    app.get('/pool/:id', passport.isLoggedIn, function(req, res){
        Pool
            .findOne({ _id: req.params.id})
            .populate({ path:'picks.user', select:'_id firstname lastname nickname'})
            .exec(function(err, pool){
                if(!pool){
                    res.render('pool.ejs', { locals: { 
                        authMessage: passport.getAuthStatus(req)
                        ,pagedata: passport.getPageData(req)
                        ,error: "Error when finding pool"
                    }});
                }
                else{
                    res.render('pool.ejs', { locals: { 
                        authMessage: passport.getAuthStatus(req)
                        ,pagedata: passport.getPageData(req)
                        ,error: null
                        ,pool: pool
                    }});
                }
            });
    });
    
    app.get('/createPool',  passport.isLoggedIn, function(req, res){
        res.render('createPool.ejs', { locals: {
            message: req.flash('createPoolMessage')
            ,authMessage: passport.getAuthStatus(req)
            ,pagedata: passport.getPageData(req)
        }});
    });
    
    app.post('/createPool', passport.isLoggedIn, function(req, res){
        process.nextTick(function() {
            var pool = new Pool();
            pool.owner = req.user._id;
            pool.name = req.body.name;
            pool.homeName = req.body.hometeam;
            pool.visitorName = req.body.visitorteam;
            pool.save(function(err) {
                if(err)
                    console.log(err);
                else
                    console.log('Created pool ' + pool._id);
                    
            });
            res.redirect('/pool');
        });
    });
    
    app.post('/buySquare', passport.isLoggedIn, function(req, res){
        //process.nextTick(function() {
            var pick = new Pick();
            pick.user = req.user._id;
            pick.position = req.body.squareId;
            
            //console.log(req.body.poolId);
            
            Pool.findById(req.body.poolId, function(err, pool){
                if(!pool){
                      
                }
                else{
                    pool.picks.push(pick);
                    pool.picks.sort("position");
                    pool.save();
                }
            });
            
            //console.log(req.body.squareId);
            //return;
        //});
        res.send(201);
        //return;
    });
    
}
