var mongoose = require('mongoose');
var User = require('../models/user.js');
var Schema = mongoose.Schema;

var pickSchema = new Schema({ 
    user : {type: Schema.Types.ObjectId, ref: 'User'}, 
    position: Number
});

module.exports = mongoose.model('Pick', pickSchema);