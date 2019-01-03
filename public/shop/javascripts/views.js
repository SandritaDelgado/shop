function render(container, name, context) {
    var source = $("#" + name).html();
    var template = Handlebars.compile(source);
    var html = template(context);
    $('#' + container).html(html);
}

function renderHomePage() {
    var context = Messages.all();
    context.hasMessages = context.errors.length | context.infos.length;
    return model.getProducts()
        .then((products) => {
            return context.products = products
        })
        .then(() => {
            return Passport.profile()
                .done(function (user) {
                    context.user = user;
                    model.getCart(context.user._id)
                        .then((cart) => {
                            context.cart = cart;
                            context.qty = 0;
                            for (let i = 0; i < context.cart.items.length; i++)
                                context.qty = context.qty + context.cart.items[i].qty
                        })
                        .then(() => {
                            render('contents', 'home-page-template', context);
                            var nav_items = $('#counter-items');
                            nav_items.html(context.qty);
                        })
                })
                .fail(function (error) {
                    console.log('ERROR!! ', error.responseText);
                    render('contents', 'home-page-template', context);
                    var nav_items = $('#counter-items');
                    nav_items.html('N');
                })
        })
    // .then(() => model.getProfile())
    // .then((user) => { context.user = user })
    // .then(() => model.getCart(context.user._id))
    // .then((cart) => {
    //     context.cart = cart;
    //     context.qty = 0;
    //     for (let i = 0; i < context.cart.items.length; i++)
    //         context.qty = context.qty + context.cart.items[i].qty
    // })
    // .then(() => {
    //     render('contents', 'home-page-template', context);
    //     var nav_items = $('#counter-items');
    //     nav_items.html(context.qty);
    // })
    // .fail(function (err) {
    //     console.error('ERROR', err);
    //     renderHomePage();
    // });
















    // var context = Messages.all();
    // context.hasMessages = context.errors.length | context.infos.length;
    // console.log(context);
    // render('contents', 'home-page-template', context);
    // if (context.hasMessages) {
    //     setTimeout(function () {
    //         if ($('#msg-notification'))
    //             $('#msg-notification').css("display", "none");
    //     }, 5000);
    // }
    // model.getProductList(function (products) {
    //     var productList = {
    //         products: products
    //     }
    //     render('main', 'list-template', productList);
    // })
    // navbarInfo();
}
function renderPageNotFound() {
    render('contents', 'page-not-found-template', null);
}
function renderSignIn() {
    var context = Messages.all();
    context.hasMessages = context.errors.length | context.infos.length;
    context.user = Controller.SigninForm.getUser();
    render('contents', 'sign-in-template', context);
    var nav_user = $('#info-user');
    nav_user.html('Not logged in');
}
function renderSignUp() {
    var context = Messages.all();
    context.hasMessages = context.errors.length | context.infos.length;
    render('contents', 'sign-up-template', context);
}
function renderProfile(uid) {
    var context = Messages.all();
    context.hasMessages = context.errors.length | context.infos.length;
    return model.getUser(uid)
        .then((user) => {
            console.log(user);
            return context.user = user
        })
        .then(() => {
            context.user.birth = context.user.birth.substring(0, 10);
        })
        .then(() => model.getCart(uid))
        .then((cart) => {
            context.cart = cart;
            context.qty = 0;
            for (let i = 0; i < context.cart.items.length; i++)
                context.qty = context.qty + context.cart.items[i].qty;
        })
        .then(()=> model.getOrders(uid))
        .then((orders) => {
            context.order = orders;            
            for(var i = 0; i < context.order.length; i++){
                context.order[i].date = context.order[i].date.substring(0, 10);
                context.order[i].idUser = context.user._id;
            }    
        })
        .then(() => {
            render('contents', 'profile-page-template', context);

            var nav_items = $('#counter-items');
            nav_items.html(context.qty);
        })
        .fail(function (err) {
            console.error(err);
            Messages.error(err.responseText);
            var context = Messages.all();
            context.hasMessages = context.errors.length | context.infos.length;
            render('contents', 'profile-page-template', context);
            var nav_items = $('#counter-items');
            nav_items.html('N');
        });
    // Passport.profile()
    //     .done(function (user) {
    //         user.birth = user.birth.substring(0, 10);
    //         var context = {
    //             user: user
    //         }
    //         render('contents', 'profile-page-template', context);
    //         navbarInfo();
    //     }).fail(function (err) {
    //         console.error(err);
    //         Messages.error(err.responseText);
    //         var context = Messages.all();
    //         context.hasMessages = context.errors.length | context.infos.length;
    //         render('contents', 'profile-page-template', context);
    //         navbarInfo();
    //     });
}
function renderCart(uid) {
    var context = Messages.all();
    context.hasMessages = context.errors.length | context.infos.length;
    return model.getUser(uid)
        .then((user) => {
            console.log(user);
            return context.user = user
        })
        .then(() => model.getCart(uid))
        .then((cart) => {
            context.cart = cart;
            context.qty = 0;
            for (var i = 0; i < context.cart.items.length; i++)
                context.qty = context.qty + context.cart.items[i].qty
        })
        .then(() => {
            render('contents', 'cart-page-template', context);

            var nav_items = $('#counter-items');
            nav_items.html(context.qty);
        })
        .fail(function (err) {
            // context.qty = 0;
            console.error('ERROR', err);
            renderHomePage();
            var nav_items = $('#counter-items');
            nav_items.html('N');
        });

    // Passport.profile()
    //     .done(function (user) {
    //         model.getCart(user._id)
    //             .done(function (usrcart) {
    //                 var context = {
    //                     cart: usrcart
    //                 }
    //                 render('contents', 'cart-page-template', context);
    //                 navbarInfo();
    //             })
    //             .fail(function (err) {
    //                 renderHomePage();
    //                 console.error(err);
    //                 navbarInfo();
    //             })
    //     }).fail(function (err) {
    //         renderHomePage();
    //         console.error(err);
    //         navbarInfo();
    //     });   
}
function renderPurchase(uid) {
    var context = Messages.all();
    context.hasMessages = context.errors.length | context.infos.length;
    return model.getUser(uid)
        .then((user) => {
            console.log(user);
            return context.user = user
        })
        .then(() => model.getCart(uid))
        .then((cart) => {
            context.cart = cart;
            context.date = new Date().toJSON().substring(0, 10)
            context.qty = 0;
            for (let i = 0; i < context.cart.items.length; i++)
                context.qty = context.qty + context.cart.items[i].qty
        })
        .then(() => {
            render('contents', 'purchase-page-template', context);
            var nav_items = $('#counter-items');
            nav_items.html(context.qty);
        })
        .fail(function (err) {
            // context.qty = 0;
            console.error('ERROR', err);
            renderHomePage();
            var nav_items = $('#counter-items');
            nav_items.html('N');
        });
    // return Passport.profile()
    //     .done(function (user) {
    //         return model.getCart(user._id)
    //             .done(function (carrito) {
    //                 console.log('weeeee', carrito.items);
    //                 var context = {
    //                     cart: carrito,
    //                     date: new Date().toJSON().substring(0, 10)
    //                 }
    //                 render('contents', 'purchase-page-template', context);
    //                 navbarInfo();
    //             })
    //             .fail(function (error) {
    //                 renderHomePage();
    //                 console.error(error);
    //                 navbarInfo();
    //             })
    //     })
    //     .fail(function (error) {
    //         renderHomePage();
    //         console.error(error);
    //         navbarInfo();
    //     })
}
function renderOrder(uid, numorder) {
    var context = Messages.all();
    context.hasMessages = context.errors.length | context.infos.length;
    return model.getUser(uid)
        .then((user) => {
            console.log(user);
            return context.user = user
        })
        .then(() => model.getOrder(context.user._id, numorder))
        .then((order) => {
            context.order = order[0];
            context.order.date = context.order.date.substring(0,10);
        })
        .then(() => {
            render('contents', 'order-page-template', context);

            // var nav_items = $('#counter-items');
            // nav_items.html(context.qty);
        })
        .fail(function (err) {
            // context.qty = 0;
            console.error('ERROR', err);
            renderHomePage();
            // var nav_items = $('#counter-items');
            // nav_items.html('N');
        });
}



// Auxilar functions
// function navCounter() {
//     var nav_items = $('#counter-items')
//     Passport.profile()
//         .done(function (user) {
//             var uid = user._id;
//             var auxcount = 0;
//             var i
//             model.getCart(uid)
//                 .done(function (cart) {
//                     for (i = 0; i < cart.items.length; i++) {
//                         auxcount = auxcount + cart.items[i].qyt;
//                     }
//                     nav_items.html(auxcount);
//                 })
//                 .fail(function (error) {
//                     nav_items.html('');
//                 });
//         })
// }
