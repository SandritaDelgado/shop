var debug = require('debug')('webpractica:routes:rest:debug')
var error = require('debug')('webpractica:routes:rest:error')

var express = require('express');
var router = express.Router();
const passport = require('passport');
const User = require('../model/user');
const Cart = require('../model/cart');
const Product = require('../model/product');
const Order = require('../model/order');
const Item = require('../model/item');

// Products
// GET shop/rest/products
router.get('/products', function (req, res, next) {
    Product.find()
        .then(function (products) {
            res.json(products);
        })
        .catch(function (e) {
            error(e.message);
            res.status(500).json(e);
        });
})
// GET shop/rest/products/:id
router.get('/products/:id', function (req, res, next) {
    Product.findById(req.params.id)
        .then(function (product) {
            res.json(product);
        })
        .catch(function (e) {
            error(e.message);
            res.status(500).json(e);
        });
})


// Shopping Cart
// GET shop/rest/users/:id/cart
router.get('/users/:id/cart', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    User.findById(req.params.id).populate('cart')
        .populate({ path: 'cart', populate: { path: 'items', populate: { path: 'product' } } })
        .populate({ path: 'items', populate: { path: 'product' } })
        .then(function (users) {
            return res.json(users.cart);
        })
        .catch(function (e) {
            error(e.message);
            res.status(500).json(e);
        });
})
// GET shop/rest/users/:id/cart/items
router.get('/users/:id/cart/items', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    User.findById(req.params.id).populate({ path: 'cart', populate: { path: 'items' } })
        .then(function (user) {
            var result = user.cart.items;
            res.json(result);
        })
        .catch(function (e) {
            error(e.message);
            res.status(500).json(e);
        });
})
// POST shop/rest/users/:id/cart/items/:pid
router.post('/users/:id/cart/items/:pid', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    return Product.findById(req.params.pid)
        .then(function (product) {
            return User.findById(req.params.id).populate('cart')
                .populate({ path: 'items', populate: { path: 'product' } })
                .populate({ path: 'cart', populate: { path: 'items' } })

                .then(function (user) {
                    var userCart = user.cart;
                    var userItems = userCart.items;
                    var i = 0;
                    var it = null;
                    while (i < userItems.length) {
                        console.log(JSON.stringify(userItems[i].product._id) == JSON.stringify(product._id));
                        if (JSON.stringify(userItems[i].product._id) == JSON.stringify(product._id)) {
                            it = userItems[i];
                        }
                        i = i + 1;
                    }
                    debug('it: ', it);
                    var promise;
                    if (it) { // if the item exists
                        it.qty++; //update quantity
                        it.price = product.price;
                        it.total = it.setTotal();
                        promise = it.save();//save it in the variable
                    }
                    else {
                        it = new Item({ qty: 1, price: product.price, total: product.price });
                        it.total = it.setTotal();
                        it.product = product;
                        promise = it.save()
                            .then(function (item) {
                                userItems.push(item);
                                return item;
                            });
                    }
                    // update the cart and save it
                    return promise.then(function (item) {
                        userCart.subtotal = userCart.setSubtotal();
                        userCart.tax = userCart.setTax();
                        userCart.total = userCart.setTotal();
                        return userCart.save();
                    });
                })
                .then(function (userCart) {
                    return res.json(userCart);
                })
        })
});
// DELETE shop/rest/users/:id/cart/items/:pid
router.delete('/users/:id/cart/items/:pid', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    return Product.findById(req.params.pid)
        .then(function (product) {
            return User.findById(req.params.id).populate('cart')
                .populate({ path: 'items', populate: { path: 'product' } })
                .populate({ path: 'cart', populate: { path: 'items' } })
                .then(function (user) {
                    var userCart = user.cart;
                    var userItems = userCart.items;
                    var i = 0;
                    var it = null;
                    while (i < userItems.length) {
                        console.log(JSON.stringify(userItems[i].product._id) == JSON.stringify(product._id));
                        if (JSON.stringify(userItems[i].product._id) == JSON.stringify(product._id)) {
                            it = userItems[i];
                        }
                        i = i + 1;
                    }

                    if (it) { // if the item exists
                        return Item.deleteOne({ _id: it._id })
                            .then(function () {
                                debug('it', it);
                                return Cart.findById(user.cart._id)
                                    .populate('items')
                            })
                            .then(function (cart) {
                                cart.items = cart.items.splice(cart.items.indexOf(it), 1);
                                cart.subtotal = cart.setSubtotal();
                                cart.tax = cart.setTax();
                                cart.total = cart.setTotal();
                                return cart.save();
                            })
                            .then(function (cart) {
                                return res.json(cart);
                            })
                            .catch(function (e) {
                                error(e);
                                return res.status(500).json(e);
                            });
                    } else {
                        return res.status(500).json({ error: 'item not found' });
                    }
                });
        })
});
// DELETE shop/rest/users/:id/cart/items/:pid/decrease
router.delete('/users/:id/cart/items/:pid/decrease', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    return Product.findById(req.params.pid)
        .then(function (product) {
            return User.findById(req.params.id).populate('cart')
                .populate({ path: 'items', populate: { path: 'product' } })
                .populate({ path: 'cart', populate: { path: 'items' } })
                .then(function (user) {
                    var userCart = user.cart;
                    var userItems = userCart.items;
                    var i = 0;
                    var it = null;
                    while (i < userItems.length) {
                        // console.log(JSON.stringify(userItems[i].product._id) == JSON.stringify(product._id));
                        if (JSON.stringify(userItems[i].product._id) == JSON.stringify(product._id)) {
                            it = userItems[i];
                        }
                        i = i + 1;
                    }
                    debug('it', it);
                    if (it) { // if the item exists
                        if (it.qty > 1) {
                            it.qty--;
                            it.total = it.setTotal();
                            return it.save()
                                .then(function (item) {
                                    userCart.subtotal = userCart.setSubtotal();
                                    userCart.tax = userCart.setTax();
                                    userCart.total = userCart.setTotal();
                                    return userCart.save();
                                })
                        } else {
                            return Item.deleteOne({ _id: it._id })
                                .then(function () {
                                    debug('it', it);
                                    return Cart.findById(user.cart._id)
                                        .populate('items')
                                })
                                .then(function (cart) {
                                    cart.items = cart.items.splice(cart.items.indexOf(it), 1);
                                    cart.subtotal = cart.setSubtotal();
                                    cart.tax = cart.setTax();
                                    cart.total = cart.setTotal();
                                    return cart.save();
                                })
                                .then(function (cart) {
                                    return res.json(cart);
                                })
                                .catch(function (e) {
                                    error(e);
                                    return res.status(500).json(e);
                                });
                        }

                    } else {
                        return res.status(500).json({ error: 'item not found' });
                    }
                });
        })
});


// Orders
// GET shop/rest/users/:id/orders
router.get('/users/:id/orders', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    User.findById(req.params.id).populate({ path: 'order', populate: { path: 'items', populate: { path: 'product' } } })
        .then(function (user) {
            res.json(user.order);
        })
        .catch(function (e) {
            error(e.message);
            res.status(500).json(e);
        });
});
// POST shop/rest/users/:id/orders
router.post('/users/:id/orders', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    User.findById(req.params.id)
        .then(function (user) {
            var ord = new Order(req.body);
            ord.save()
                .then(function (ord) {
                    user.order.push(ord);
                    return user.save()
                })
                .then((user) => {
                    var cart = new Cart();
                    cart.save()
                    .then(function (cart) {
                        user.cart = cart;
                        return user.save()
                    })
                })
                .then((user) => res.json(user))
                .catch((err) => res.status(500).json(err));
        })
        .catch((err) => res.status(500).json(err));
});
// GET shop/rest/users/:id/orders/:number
router.get('/users/:id/orders/:number', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    User.findById(req.params.id).populate({ path: 'order', match: { number: req.params.number }, populate: { path: 'items', populate: { path: 'product' } } })
        .then(function (user) {
            res.json(user.order);
        })
        .catch(function (e) {
            error(e.message);
            res.status(500).json(e);
        });
});
// GET shop/rest/users/:id/orders/:number/items
router.get('/users/:id/orders/:number/items', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    User.findById(req.params.id).populate({ path: 'order', match: { number: req.params.number }, populate: { path: 'items', populate: { path: 'product' } } })
        .then(function (user) {
            res.json(user.order);
        })
        .catch((err) => res.status(500).json(err));
});






// User
// GET /shop/rest/users
router.get('/users', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    User.find()
        .then(function (users) {
            res.json(users);
        })
        .catch(function (e) {
            error(e.message);
            res.status(500).json(e);
        });
});
// GET /shop/rest/users/:id
router.get('/users/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    User.findById(req.params.id)
        .then(function (users) {
            res.json(users);
        })
        .catch(function (e) {
            error(e.message);
            res.status(500).json(e);
        });
});
// POST /shop/rest/users 
router.post('/users', function (req, res, next) {
    new User(req.body)
        .save()
        .then(function (user) {
            debug('User added', user);
            res.json(user)
        })
        .catch(function (e) {
            error(e.message);
            res.status(500).json(e);
        });
});
// DELETE /shop/rest/users
router.delete('/users', function (req, res, next) {
    User.deleteMany({})
        .then(function (result) {
            res.json({ ok: result })
        })
        .catch(function (e) {
            error(e.message);
            res.status(500).json(e);
        });
});
// DELETE /shop/rest/users/:id 
router.delete('/users/:id', function (req, res, next) {
    User.deleteOne({ _id: req.params.id })
        .then(function (result) {
            res.json({ ok: result });
        })
        .catch(function (e) {
            error(e.message);
            res.status(500).json(e);
        });
});
// PUT /shop/rest/users
router.put('/users', function (req, res, next) {
    User.deleteMany({})
        .then(function () {
            var promises = [];
            var users = req.body;
            for (let i = 0; i < users.length; i++) {
                promises.push(new User(users[i]).save());
            }
            return Promise.all(promises);
        })
        .then(function (result) {
            res.json(result);
        })
        .catch(function (e) {
            error(e.message);
            res.status(500).json({
                errors: { drop: e }
            });
        });
});
// PUT /shop/rest/users/:id
router.put('/users/:id', function (req, res, next) {
    User.findById(req.params.id)
        .then(function (user) {
            user.set(req.body);
            return user.save();
        })
        .then(function (result) {
            res.json(result);
        })
        .catch(function (e) {
            error(e.message);
            res.status(500).json({ errors: { drop: e } });
        });
});

module.exports = router;