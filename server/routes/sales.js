var models = require('./../models');
var express = require('express');
var router = express.Router();
var common = require('./common');

router.post('/dailycash', common.isAuthenticate, function(request, response) {

    models.Sale.findAll({
        include: [{ model: models.User }],
        where: { dateregister: common.formatDate(request.body.dateregister), iduser: request.body.iduser, status: 1 },
        order: 'idschedule ASC'
    }).then(function(res) {
        response.send(common.response(res));
    }).catch(function(err) {
        response.send(common.response(err.code, err.message, false));
    });
});

module.exports = router;