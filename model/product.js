const debug = require('debug')('webpractica:model:user:debug');
const error = require('debug')('webpractica:model:user:error');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    url: { type: String, required: true },
    type: { type: String, required: true },
    height: { type: String, required: true },
    weight: { type: String, required: true },
    physical: { type: String, required: true },
    ideal: { type: String, required: true }
});

module.exports = mongoose.model('Product', schema);