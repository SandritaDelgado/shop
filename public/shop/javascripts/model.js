var model = {};

model.getProducts = function () {
    return $.ajax({
        type: "GET",
        url: '/shop/rest/products',
        dataType: 'json'
    });
}
model.getUser = function (uid) {
    return $.ajax({
        type: "GET",
        url: '/shop/rest/users/' + uid,
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + Passport.getToken());
        }
    });
};
model.getCart = function (uid) {
    return $.ajax({
        type: "GET",
        url: '/shop/rest/users/' + uid + '/cart',
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + Passport.getToken());
        }
    })
}
model.itemToCart = function (pid) {
    return Passport.profile()
        .done(function (user) {
            return $.ajax({
                type: "POST",
                url: '/shop/rest/users/' + user._id + '/cart/items/' + pid,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + Passport.getToken());
                }
            });
        });
}
model.decreaseItem = function (pid) {
    return Passport.profile()
        .done(function (user) {
            return $.ajax({
                type: "DELETE",
                url: '/shop/rest/users/' + user._id + '/cart/items/' + pid + '/decrease',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + Passport.getToken());
                }
            });
        });
}
model.removeItem = function (pid) {
    return Passport.profile()
        .done(function (user) {
            return $.ajax({
                type: "DELETE",
                url: '/shop/rest/users/' + user._id + '/cart/items/' + pid,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + Passport.getToken());
                }
            });
        });
}

// model.counterItems = function (uid) {
//     return $.ajax({
//         type: "GET",
//         url: '/shop/rest/users/' + uid + '/cart/items',
//         dataType: 'json',
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader('Authorization', 'Bearer ' + Passport.getToken());
//         }
//     });
// }
model.getOrders = function (uid) {
    return $.ajax({
        type: "GET",
        url: '/shop/rest/users/' + uid + '/orders',
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + Passport.getToken());
        }
    })
}
model.getOrder = function (uid, numorder) {
    return $.ajax({
        type: "GET",
        url: '/shop/rest/users/' + uid + '/orders/' + numorder,
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + Passport.getToken());
        }
    })
}

model.createOrder = function (uid, order) {
    console.log('Model createOrder: ', uid, order)
    return $.ajax({
        type: "POST",
        url: '/shop/rest/users/' + uid + '/orders',
        data: order,
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + Passport.getToken());
        }
    });
}