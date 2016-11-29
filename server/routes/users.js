var models = require('./../models');
var express = require('express');
var router = express.Router();
var common = require('./common');
var jwt = require("jsonwebtoken");

router.post('/create', common.isAuthenticate, function (request, response) {
  var token = jwt.sign(request.body, "AIzaSyAQfxPJiounkhOjODEO5ZieffeBv6yft2Q");
  models.User.create({
    username: request.body.username,
    firstname: request.body.firstname,
    lastname: request.body.lastname,
    password: request.body.password,
    email: request.body.email,
    idrole: request.body.idrole,
    token: token
  }).then(function (res) {
    response.send(common.response(res, "Se guardo correctamente"));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});

router.post('/update', common.isAuthenticate, function (request, response) {
  models.User.update({
    username: request.body.username,
    firstname: request.body.firstname,
    lastname: request.body.lastname,
    password: request.body.password,
    email: request.body.email,
    idrole: request.body.idrole
  }, {
      where: { id: request.body.id }
    }).then(function (res) {
      response.send(common.response(res, "Se guardo correctamente"));
    }).catch(function (err) {
      response.send(common.response(err.code, err.message, false));
    });
});

router.get('/', common.isAuthenticate, function (request, response) {
  models.User.findAll({
    include: [models.Role]
  }).then(function (res) {
    response.send(common.response(res));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});

router.get('/forselect', common.isAuthenticate, function (request, response) {
  models.User.findAll({
    attributes: ["id", "username", "firstname", "lastname"],
    order: ["firstname", "lastname"]
  }).then(function (res) {
    response.send(common.response(res));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});

router.post('/destroy', common.isAuthenticate, function (request, response) {
  models.User.destroy({
    where: { id: request.body.id }
  }).then(function () {
    response.send(common.response("", "Se elimino correctamente"));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});

module.exports = router;