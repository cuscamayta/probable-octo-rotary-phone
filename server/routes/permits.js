var models = require('./../models');
var express = require('express');
var router = express.Router();
var common = require('./common');

router.post('/create', common.isAuthenticate, function(request, response) {
    models.Permit.create({
        idrole: request.body.idrole,
        idpage: request.body.idpage
    }).then(function(res) {
        response.send(common.response(res, "Se guardo correctamente"));
    }).catch(function(err) {
        response.send(common.response(err.code, err.message, false));
    });
});

router.get('/', common.isAuthenticate, function(request, response) {
    models.Permit.findAll({
        include: [{ model: models.Role }, { model: models.Page }]
    }).then(function(res) {
        response.send(common.response(res));
    }).catch(function(err) {
        response.send(common.response(err.code, err.message, false));
    });
});

router.post('/destroy', common.isAuthenticate, function(request, response) {
    models.Permit.destroy({
        where: { id: request.body.id }
    }).then(function() {
        response.send(common.response("", "Se elimino correctamente"));
    }).catch(function(err) {
        response.send(common.response(err.code, err.message, false));
    });
});

module.exports = router;