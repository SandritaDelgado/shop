const debug = require('debug')('webpractica:model:user:debug');
const error = require('debug')('webpractica:model:user:error');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = Schema({
    number: { type: Number, default: 0},
    date: { type: Date, default: Date.now },
    address: { type: String, required: false },
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 1.21 },
    total: { type: Number, default: 0 },
    cardHolder: { type: String, required: false },
    cardNumber: { type: Number, default: 0 },

    items: [{ type: Schema.Types.ObjectId, ref: 'Item' }]
});

module.exports = mongoose.model('Order', schema);