var models = require('./../models');
var express = require('express');
var router = express.Router();
var common = require('./common');

router.post('/create', common.isAuthenticate, function (request, response) {
    models.Setting.create({
        title: request.body.title,
        numberid: request.body.numberid,
        note: request.body.note,
    }).then(function (res) {
        response.send(common.response(res, "Se guardo correctamente"));
    }).catch(function (err) {
        response.send(common.response(err.code, err.message, false));
    });
});

router.post('/update', common.isAuthenticate, function (request, response) {
    models.Setting.update({
        title: request.body.title,
        numberid: request.body.numberid,
        note: request.body.note,
    }, {
            where: { id: request.body.id }
        }).then(function (res) {
            response.send(common.response(res, "Se guardo correctamente"));
        }).catch(function (err) {
            response.send(common.response(err.code, err.message, false));
        });
});

router.get('/', common.isAuthenticate, function (request, response) {
    models.Setting.findAll().then(function (res) {
        response.send(common.response(res));
    }).catch(function (err) {
        response.send(common.response(err.code, err.message, false));
    });
});

module.exports = router;