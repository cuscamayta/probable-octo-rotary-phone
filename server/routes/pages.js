var models = require('./../models');
var express = require('express');
var router = express.Router();
var common = require('./common');

router.post('/create', common.isAuthenticate, function(request, response) {
    models.Page.create({
        title: request.body.title,
        path: request.body.path,
        idmodule: request.body.idmodule
    }).then(function(res) {
        response.send(common.response(res, "Se guardo correctamente"));
    }).catch(function(err) {
        response.send(common.response(err.code, err.message, false));
    });
});

router.post('/update', common.isAuthenticate, function(request, response) {
    models.Page.update({
        title: request.body.title,
        path: request.body.path,
        idmodule: request.body.idmodule
    }, {
            where: { id: request.body.id }
        }).then(function(res) {
            response.send(common.response(res, "Se guardo correctamente"));
        }).catch(function(err) {
            response.send(common.response(err.code, err.message, false));
        });
});

router.get('/', common.isAuthenticate, function(request, response) {
    models.Page.findAll({
        include: [{ model: models.Module }]
    }).then(function(res) {
        response.send(common.response(res));
    }).catch(function(err) {
        response.send(common.response(err.code, err.message, false));
    });
});

router.post('/destroy', common.isAuthenticate, function(request, response) {
    models.Page.destroy({
        where: { id: request.body.id }
    }).then(function() {
        response.send(common.response("", "Se elimino correctamente"));
    }).catch(function(err) {
        response.send(common.response(err.code, err.message, false));
    });
});

module.exports = router;