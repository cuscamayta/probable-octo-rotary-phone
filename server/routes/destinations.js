var models = require('./../models');
var express = require('express');
var router = express.Router();
var common = require('./common');

router.post('/create', common.isAuthenticate, function (request, response) {
  models.Destination.create({
    title: request.body.title,
    short: request.body.short
  }).then(function (res) {
    response.send(common.response(res, "Se guardo correctamente"));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});

router.post('/update', common.isAuthenticate, function (request, response) {
  models.Destination.update({
    title: request.body.title,
    short: request.body.short
  }, {
      where: { id: request.body.id }
    }).then(function (res) {
      response.send(common.response(res, "Se guardo correctamente"));
    }).catch(function (err) {
      response.send(common.response(err.code, err.message, false));
    });
});

router.get('/', common.isAuthenticate, function (request, response) {
  models.Destination.findAll().then(function (res) {
    response.send(common.response(res));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});

router.post('/destroy', common.isAuthenticate, function (request, response) {
  models.Destination.destroy({
    where: { id: request.body.id }
  }).then(function () {
    response.send(common.response("", "Se elimino correctamente"));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});

module.exports = router;