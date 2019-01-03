function parseQueryParameters(str) {
    return (str || document.location.search).replace(/(^\?)/, '').split("&").map(function (n) {
        return n = n.split("="), this[n[0]] = n[1], this
    }.bind({}))[0];
}

function go(event, url) {
    url = url ? url : event.target.href;
    event.preventDefault();
    history.pushState(null, '', url);
    route();
}

function route() {
    console.log('Routing', location.href);
    console.log('Pathname', location.pathname);
    var p = location.pathname;
    var m;
    if (p == "/shop/views" || p == "/shop/views/" || p == "/shop/views/products")
        renderHomePage();
    else if (p == "/shop/views/signup")
        renderSignUp();
    else if (p == "/shop/views/signin")
        renderSignIn();
    else if (m = p.match(/\/shop\/views\/users\/(\w*)$/g)) {
        m = m[m.length - 1].split('/');
        var uid = m[m.length - 1];
        renderProfile(uid);
    }
    else if (m = p.match(/\/shop\/views\/users\/(\w*)\/cart$/g)) {
        m = m[m.length - 1].split('/');
        var uid = m[m.length - 2];
        renderCart(uid);
    }
    else if (m = p.match(/\/shop\/views\/users\/(\w*)\/purchase$/g)) {
        m = m[m.length - 1].split('/');
        var id = m[m.length - 2];
        renderPurchase(id);
    }
    else if (m = p.match(/\/shop\/views\/users\/(\w*)\/orders\/(\d*)$/g)) {
        m = m[m.length - 1].split('/');
        var numorder = m[m.length - 1];
        var uid = m[m.length - 3];
        console.log(uid, numorder);
        renderOrder(uid, numorder);
    }
    else renderPageNotFound();
    console.log(location.href, 'routed')
}