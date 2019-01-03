Handlebars.registerPartial('nav', `
<nav id="navigation" class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
    <a class="navbar-brand" href="/shop/views">
        <img src="https://image.winudf.com/v2/image/Y29tLm9udXJoYXphci5iYm9va19pY29uXzE1MzgxNjI2MTBfMDA5/icon.png?w=170&fakeurl=1&type=.png" height="30px" width="30px">
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div id="info-user" class="navbar-brand navbar-collapse d-flex justify-content-center text-light">
        {{#if user}}Welcome again, {{user.name}}{{else}}Not logged in{{/if}}
    </div>
    <div class="collapse navbar-collapse justify-content-end" id="navbarsExampleDefault">
        <ul class="navbar-nav">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Shopping Cart&nbsp;
                    <span id="counter-items" class="badge"></span></a>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdown01">
                    <a class="dropdown-item" href="/shop/views/users/{{user._id}}/cart" onclick="Controller.showCart(event)"><i class="fa fa-shopping-cart fa-fw"></i> Show cart</a>
                    <a class="dropdown-item" href="/shop/views/users/{{user._id}}/purchase" onclick="Controller.purchase(event)"><i class="fa fa-credit-card fa-fw"></i> Purchase</a>
                </div>                
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">User&nbsp;</a>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdown01">                
                    <a class="dropdown-item" href="/shop/views/signin" onclick="go(event)"><i class="fa fa-sign-in fa-fw"></i> Sign In</a>
                    <a class="dropdown-item" href="/shop/views" onclick="Controller.signout(event)"><i class="fa fa-sign-out fa-fw"></i> Sign Out</a>
                    <a class="dropdown-item" href="/shop/views/signup" onclick="go(event)"><i class="fa fa-user-plus fa-fw"></i> Sign Up</a>                    
                    <a class="dropdown-item" href="/shop/views/users/{{user._id}}" onclick="Controller.profile(event)"><i class="fa fa-address-card fa-fw"></i> Profile</a>
                </div>
            </li>
        </ul>
    </div>
</nav>
`);
Handlebars.registerPartial('footer', `
<footer class="text-center">
    <hr>SPA created by Sandra Delgado Martínez for Web and Service Engineering subject 2018/2019</hr>
</footer>
`);
Handlebars.registerPartial('showMessages', `
<div class="form-group" id="msg-notification">
    {{#if hasMessages}}
    <ul class="list-group ">
        {{#each errors}}
        <li class="list-group-item list-group-item-danger textleft">
            <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
            {{message}}
        </li>
        {{/each}}
        {{#each infos}}
        <li class="list-group-item list-group-item-success textleft">
            <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
            {{message}}
        </li>
        {{/each}}
    {{/if}}
    </ul>
</div>
`);