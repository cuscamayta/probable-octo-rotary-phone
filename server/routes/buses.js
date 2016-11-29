var models = require('./../models');
var express = require('express');
var router = express.Router();
var common = require('./common');

router.post('/create', common.isAuthenticate, function (request, response) {
  models.Bus.create({
    numberid: request.body.numberid,
    numberseats: request.body.numberseats,
    numberrows: request.body.numberrows,
    numberfloors: request.body.numberfloors,
    color: request.body.color,
    model: request.body.model,
    make: request.body.make,
    detail: request.body.detail,
    idbustype: request.body.idbustype
  }).then(function (res) {
    response.send(common.response(res, "Se guardo correctamente"));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});

router.post('/update', common.isAuthenticate, function (request, response) {
  models.Bus.update({
    numberid: request.body.numberid,
    numberseats: request.body.numberseats,
    numberrows: request.body.numberrows,
    numberfloors: request.body.numberfloors,
    color: request.body.color,
    model: request.body.model,
    make: request.body.make,
    detail: request.body.detail,
    idbustype: request.body.idbustype
  }, {
      where: { id: request.body.id }
    }).then(function (res) {
      response.send(common.response(res, "Se guardo correctamente"));
    }).catch(function (err) {
      response.send(common.response(err.code, err.message, false));
    });
});

router.get('/', common.isAuthenticate, function (request, response) {
  models.Bus.findAll({
    include: [{ model: models.Bustype }]
  }).then(function (res) {
    response.send(common.response(res));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});

router.get('/forselect', common.isAuthenticate, function (request, response) {
  models.Bus.findAll({
    attributes: ["id", "numberid"]
  }).then(function (res) {
    response.send(common.response(res));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});

router.post('/destroy', common.isAuthenticate, function (request, response) {
  models.Bus.destroy({
    where: { id: request.body.id }
  }).then(function () {
    response.send(common.response("", "Se elimino correctamente"));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});

module.exports = router;