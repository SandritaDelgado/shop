var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('*', function(req, res, next) {
    return res.sendFile(path.join(__dirname, '../views/shop.html'));
});

module.exports = router;