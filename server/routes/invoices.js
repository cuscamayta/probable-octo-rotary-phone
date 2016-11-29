var models = require('./../models');
var express = require('express');
var router = express.Router();
var common = require('./common');
var invoice = require('./codecontrol');

router.post('/generate', function (request, response) {

    var result = invoice.generateControlCode(
        request.body.numberorder, request.body.numberinvoice, request.body.numberid, request.body.date,
        request.body.amount, request.body.controlkey
    );

    try {
        response.send(result);
    } catch (ex) {
        response.send(common.response("", ex.message, false));
    }

});

module.exports = router;