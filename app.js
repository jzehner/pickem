
/**
 * Module dependencies.
 */

var flash = require('connect-flash');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var express = require('express');
var passport = require('passport');

var configDB = require('./config/database.js');

var app = express();

mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport);

app.configure(function() {
    app.use(express.favicon(__dirname + '/public/favicon.ico'));
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.session({secret:'WhatsTheAirspeedVelocityOfAnUnladenSwallow'}));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session()); 
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(app.router);
    
    
});


require('./routes/auth.js')(app,passport);
require('./routes/main.js')(app,passport);
require('./routes/pool.js')(app,passport);
require('./routes/rest/restAuth.js')(app,passport);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
