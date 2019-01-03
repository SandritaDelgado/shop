var Passport = { content: 'content' }

Passport.signin = function (user) {
    console.log('Passport signin', user)
    return $.ajax({
        type: "POST",
        url: '/shop/passport/signin',
        data: user,
        dataType: 'json'
    })
}
Passport.signup = function (user) {
    return $.ajax({
        type: "POST",
        url: '/shop/passport/signup',
        data: user,
        dataType: 'json'
    });
}
Passport.profile = function () {
    return $.ajax({
        type: "GET", 
        url: '/shop/passport/profile',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization','Bearer ' + Passport.getToken());
        }
    });
}

Passport.signout = function () {
    document.cookie = document.cookie + ";expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
}
Passport.setToken = (token) => {
    var d = new Date();
    d.setTime(d.getTime() + (1 * 60 * 1000)); // minutes
    document.cookie = JSON.stringify(token) + ";path=/";
}
Passport.getToken = () => {
    if (document.cookie.length < 1) return null;
    else return JSON.parse(document.cookie).token;
}