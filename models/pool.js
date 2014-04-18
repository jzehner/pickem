var mongoose = require('mongoose');
var User = require('../models/user.js');
var Pick = require('../models/pick.js');
var Schema = mongoose.Schema;


var poolSchema = mongoose.Schema({
    name        : String,
    homeName    : String,
    visitorName : String,
    owner       : Schema.ObjectId,
    picks       : [Pick.pickSchema],
    active      : Boolean
    
});

module.exports = mongoose.model('Pool', poolSchema);
