var Controller = { SigninForm: {}, SignupForm: {}, PurchaseForm: {} };


Controller.SignupForm.getUser = () => {
    return {
        email: $('#email').val(),
        password: $('#password').val(),
        password2: $('#password2').val(),
        name: $('#name').val(),
        surname: $('#surname').val(),
        birth: $('#birth').val(),
        address: $('#address').val()
    };
}
Controller.SignupForm.setUser = (user) => {
    $('#email').val(user.email);
    $('#password').val('');
    $('#name').val(user.name);
    $('#surname').val(user.surname);
    $('#birth').val(user.birth);
    $('#address').val(user.address)
}
Controller.SignupForm.clearUser = () => {
    $('#email').val('');
    $('#password').val('');
    $('#name').val('');
    $('#surname').val('');
    $('#birth').val('');
    $('#address').val('');
}
Controller.SignupForm.validateForm = () => {
    var valid;
    valid = $('#signup-form')[0].checkValidity();
    $('#signup-form').addClass('was-validated');
    return valid;
}
Controller.SignupForm.signupClicked = (event) => {
    Messages.all(); // Clears messages
    var user = Controller.SignupForm.getUser();
    var validForm = Controller.SignupForm.validateForm();
    if (validForm) {
        var passwordMatch = user.password === user.password2;
        if (!passwordMatch) {
            Messages.error('Password mismatch');
            go(event, '/shop/views/signup');
            return;
        }
        return Passport.signup(user)
            .done(function (result) {
                console.log('Signed Up user: ', result);
                Messages.info('Signup Success');
                go(event, '/shop/views/');
            })
            .fail(function (result) {
                console.log('RESULT: ', result.responseText);
                var errors = result.responseJSON.errors;
                if (errors) {
                    var messages = Object.values(errors);
                    for (let index = 0; index < messages.length; index++) {
                        const message = messages[index];
                        Messages.error(message.message);
                    }
                }
                go(event, '/shop/views/signup');
            });
    }
};


Controller.SigninForm.getUser = () => {
    return {
        email: $('#email').val(),
        password: $('#password').val()
    };
}
Controller.SigninForm.setUser = (user) => {
    $('#email').val(user.email);
    $('#password').val('')
}
Controller.SigninForm.clearUser = () => {
    $('#email').val('');
    $('#password').val('')
}
Controller.SigninForm.validateForm = () => {
    var valid;
    valid = $('#signin-form')[0].checkValidity();
    $('#signin-form').addClass('was-validated');
    return valid;
}
Controller.SigninForm.signin = (event) => {
    Messages.all(); // Clears messages
    var user = Controller.SigninForm.getUser();
    var valid = Controller.SigninForm.validateForm();
    if (valid) {
        return Passport.signin(user)
            .done(function (result) {
                Messages.info('Welcome ');
                console.log('Signin success', result)
                Passport.setToken(result);
                go(event, '/shop/views/');
            })
            .fail(function (result) {
                var errors = result.responseJSON.errors
                if (errors) {
                    var messages = Object.values(errors);
                    for (let index = 0; index < messages.length; index++) {
                        const message = messages[index];
                        Messages.error(message.message);
                    }
                }
                go(event, '/shop/views/signin');
            });
    } else {
        Messages.error('Invalid form data');
    }
}
 Controller.order=(event,number)=>{
	 event.preventDefault();
	 return Passport.profile()
	 .done(function (user) {
		 model.getOrder(user._id, number)
			.then((order) =>{
				go(event, '/shop/views/users/'+user._id+'/orders'+order[0].number);
			})
			.fail(function (error) {
            Messages.error('ERROR going to order: ', error);
            go(event, '/shop/views/')
        })
	  })
	 .fail(function (error) {
            Messages.error('Not logged in');
            go(event, '/shop/views/')
        })
 }

Controller.profile = (event) => {
    event.preventDefault();
    return Passport.profile()
        .done(function (user) {
            go(event, '/shop/views/users/' + user._id);
        })
        .fail(function (error) {
            Messages.error('Not logged in');
            go(event, '/shop/views/')
        })
}
Controller.showCart = (event) => {
    event.preventDefault();
    return Passport.profile()
        .done(function (user) {
            go(event, '/shop/views/users/' + user._id + '/cart');
        })
        .fail(function (error) {
            Messages.error('Not logged in');
            go(event, '/shop/views/')
        })
}
Controller.purchase = (event) => {
    event.preventDefault();
    return Passport.profile()
        .done(function (user) {
            model.getCart(user._id)
                .then((cart) => {
                    if (cart.items.length == 0) {
                        Messages.error('Cart is empty');
                        go(event, '/shop/views/');
                    }
                    else go(event, '/shop/views/users/' + user._id + '/purchase');
                })
        })
        .fail(function (error) {
            Messages.error('Not logged in');
            go(event, '/shop/views/')
        })
}
Controller.signout = (event) => {
    event.preventDefault();
    return Passport.profile()
        .done(function (user) {
            Passport.signout();
            Messages.info('Thank you. Come again');
            $('#info-user').html('Not logged');
            $('#counter-items').html('N');
            go(event, '/shop/views/');
        })
        .fail(function (error) {
            Messages.error('Not logged in');
            go(event, '/shop/views/')
        })




}
Controller.itemToCart = (event, id) => {
    event.preventDefault();
    model.itemToCart(id)
        .done(function () {
            Messages.info('✔ Product added to cart. Yay!!');
            go(event, '/shop/views');
        })
        .fail(function () {
            Messages.error('Not logged in');
            go(event, '/shop/views/');
        })
}
Controller.decreaseItem = (event, pid) => {
    event.preventDefault();
    return Passport.profile()
        .done(function (user) {
            model.decreaseItem(pid)
                .done(function () {
                    // Messages.info('Quantity of product reduced.');
                    go(event, '/shop/views/users/' + user._id + '/cart');
                })
                .fail(function () {
                    Messages.error('Registration is required to reduce items.');
                    go(event, '/shop/views/');
                })
        })
        .fail(function (error) {
            console.log(error);
        })

}
Controller.removeItem = (event, pid) => {
    event.preventDefault();
    return Passport.profile()
        .done(function (user) {
            model.removeItem(pid)
                .done(function () {
                    // Messages.info('Product remove to cart.');
                    go(event, '/shop/views/users/' + user._id + '/cart');
                })
                .fail(function () {
                    Messages.error('Registration is required to remove items.');
                    go(event, '/shop/views/');
                })
        })
        .fail(function (error) {
            console.log(error);
        })
}


Controller.PurchaseForm.purchaseClicked = (event) => {
    Messages.all(); // Clears messages
    var purchase = Controller.PurchaseForm.getPurchase();
    var validForm = Controller.PurchaseForm.validateForm();
    if (validForm) {
        console.log('Generating order...');
        return Passport.profile()
            .done(function (user) {
                model.getCart(user._id)
                    .then((cart) => {
                        var order = {
                            number: new Date().getTime(),
                            date: purchase.date,
                            address: purchase.address,
                            items: cart.items,
                            cardHolder: purchase.cardHolder,
                            cardNumber: purchase.cardNumber,
                            subtotal: purchase.subtotal,
                            tax: purchase.tax,
                            total: purchase.total
                        }
                        model.createOrder(user._id, order)
                    })
                    .then(() => {
                        Messages.info('Purchased! Yay')
                        go(event, '/shop/views/');
                    })
                    .fail(function (err) {
                        // context.qty = 0;
                        console.error('ERROR al crear order: ', err);
                        go(event, '/shop/views/');
                    });
            })
            .fail(function (result) {
                console.log('RESULT: ', result.responseText);
                var errors = result.responseJSON.errors;
                if (errors) {
                    var messages = Object.values(errors);
                    for (let index = 0; index < messages.length; index++) {
                        const message = messages[index];
                        Messages.error(message.message);
                    }
                }
                go(event, '/shop/views/');
            });
    }
    else {
        Messages.error('Some data needed to purchase.');
        go(event, '/shop/views/');
    }
}
Controller.PurchaseForm.validateForm = () => {
    var valid;
    valid = $('#purchase-form')[0].checkValidity();
    $('#purchase-form').addClass('was-validated');
    return valid;
}
Controller.PurchaseForm.getPurchase = () => {
    return {
        date: $('#date').val(),
        address: $('#address').val(),
        cardHolder: $('#cardholder').val(),
        cardNumber: $('#cardnumber').val(),
        subtotal: $('#subtotal').val(),
        tax: $('#tax').val(),
        total: $('#total').val()
    };
}