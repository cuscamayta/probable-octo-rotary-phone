var models = require('./../models');
var express = require('express');
var router = express.Router();
var common = require('./common');
var sequelize = require('sequelize');

router.post('/create', common.isAuthenticate, function (request, response) {
  models.Driver.create({
    numberid: request.body.numberid,
    firstname: request.body.firstname,
    lastname: request.body.lastname,
    birthdate: request.body.birthdate,
    iddrivertype: request.body.iddrivertype
  }).then(function (res) {
    response.send(common.response(res, "Se guardo correctamente"));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});

router.post('/update', common.isAuthenticate, function (request, response) {
  models.Driver.update({
    numberid: request.body.numberid,
    firstname: request.body.firstname,
    lastname: request.body.lastname,
    birthdate: request.body.birthdate,
    iddrivertype: request.body.iddrivertype
  }, {
      where: { id: request.body.id }
    }).then(function (res) {
      response.send(common.response(res, "Se guardo correctamente"));
    }).catch(function (err) {
      response.send(common.response(err.code, err.message, false));
    });
});

router.get('/', common.isAuthenticate, function (request, response) {
  models.Driver.findAll({
    include: [{ model: models.Drivertype }]
  }).then(function (res) {
    response.send(common.response(res));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});

router.get('/forselect', common.isAuthenticate, function (request, response) {
  models.Driver.findAll({
    attributes: ["id", "firstname", "lastname"],
    order: [["firstname", "ASC"]]
  }).then(function (res) {
    response.send(common.response(res));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});

router.post('/destroy', common.isAuthenticate, function (request, response) {
  models.Driver.destroy({
    where: { id: request.body.id }
  }).then(function () {
    response.send(common.response("", "Se elimino correctamente"));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});

module.exports = router;