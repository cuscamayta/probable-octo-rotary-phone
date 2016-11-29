var models = require('./../models');
var express = require('express');
var router = express.Router();
var common = require('./common');

router.post('/forselect', common.isAuthenticate, function(request, response) {

    models.Salesbook.findAll({
        include: [{ model: models.Office }],
        where: { dateregister: common.formatDate(request.body.dateregister), idoffice: request.body.idoffice, status: 1 },
        order: 'numberinvoice ASC'
    }).then(function(res) {
        response.send(common.response(res));
    }).catch(function(err) {
        response.send(common.response(err.code, err.message, false));
    });
});

module.exports = router;