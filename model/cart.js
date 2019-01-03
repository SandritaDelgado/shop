const debug = require('debug')('webpractica:model:user:debug');
const error = require('debug')('webpractica:model:user:error');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = Schema({
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    items: [{ type: Schema.Types.ObjectId, ref: 'Item' }]
});

schema.methods.setTotal = function () {
    return (this.subtotal + this.tax).toFixed(2);
};

schema.methods.setTax = function () {
    return (this.subtotal * 0.21).toFixed(2);
};

schema.methods.setSubtotal = function () {
    var result = 0;
    for (i = 0; i < this.items.length; i++) {
        result += this.items[i].total;
    }
    return result.toFixed(2);
};


module.exports = mongoose.model('Cart', schema);