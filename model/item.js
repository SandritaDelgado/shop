const debug = require('debug')('webpractica:model:user:debug');
const error = require('debug')('webpractica:model:user:error');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = Schema({
    order: { type: Number, default: 0 },
    qty: { type: Number, default: 0},
    price: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    product: { type: Schema.Types.ObjectId, ref: 'Product' }
});

schema.methods.setTotal = function () {
    return (this.qty * this.price).toFixed(2);
};

module.exports = mongoose.model('Item', schema);