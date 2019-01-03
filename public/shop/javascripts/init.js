window.addEventListener('popstate', function (event) { route(); }, false);

$(function(){
    console.log('Initializing page');
    route();
    console.log('Page initialized');
});