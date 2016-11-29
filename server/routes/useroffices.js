var models = require('./../models');
var express = require('express');
var router = express.Router();
var common = require('./common');

router.post('/create', common.isAuthenticate, function (request, response) {
    models.Useroffice.create({
        iduser: request.body.iduser,
        idoffice: request.body.idoffice
    }).then(function (res) {
        response.send(common.response(res, "Se guardo correctamente"));
    }).catch(function (err) {
        response.send(common.response(err.code, err.message, false));
    });
});

router.get('/', common.isAuthenticate, function (request, response) {
    models.Useroffice.findAll({
        include: [{ model: models.User }, { model: models.Office }]
    }).then(function (res) {
        response.send(common.response(res));
    }).catch(function (err) {
        response.send(common.response(err.code, err.message, false));
    });
});

router.post('/destroy', common.isAuthenticate, function (request, response) {
    models.Useroffice.destroy({
        where: { id: request.body.id }
    }).then(function () {
        response.send(common.response("", "Se elimino correctamente"));
    }).catch(function (err) {
        response.send(common.response(err.code, err.message, false));
    });
});

module.exports = router;