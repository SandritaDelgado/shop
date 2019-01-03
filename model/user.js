const debug = require('debug')('webpractica:model:user:debug');
const error = require('debug')('webpractica:model:user:error');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var schema = Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    birth: { type: Date, required: true },
    address: { type: String, required: true },
    cart: { type: Schema.Types.ObjectId, ref: 'Cart' },
    order: [{ type: Schema.Types.ObjectId, ref: 'Order' }]
});

schema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
};
schema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', schema);