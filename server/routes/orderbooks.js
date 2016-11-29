var models = require('./../models');
var express = require('express');
var router = express.Router();
var common = require('./common');

router.post('/create', common.isAuthenticate, function (request, response) {
  models.Orderbook.create({
    type: request.body.type,
    status: request.body.status,
    numberorder: request.body.numberorder,
    controlkey: request.body.controlkey,
    dateofissue: request.body.dateofissue,
    deadline: request.body.deadline,
    idoffice: request.body.idoffice,
  }).then(function (res) {
    response.send(common.response(res, "Se guardo correctamente"));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});

router.post('/update', common.isAuthenticate, function (request, response) {
  models.Orderbook.update({
    type: request.body.type,
    status: request.body.status,
    numberorder: request.body.numberorder,
    controlkey: request.body.controlkey,
    dateofissue: request.body.dateofissue,
    deadline: request.body.deadline,
    idoffice: request.body.idoffice,
  }, {
      where: { id: request.body.id }
    }).then(function (res) {
      response.send(common.response(res, "Se guardo correctamente"));
    }).catch(function (err) {
      response.send(common.response(err.code, err.message, false));
    });
});

router.post('/updatestatus', common.isAuthenticate, function (request, response) {
  models.Orderbook.update({
    status: request.body.status,
  }, {
      where: { id: request.body.id }
    }).then(function (res) {
      response.send(common.response(res, "Se guardo correctamente"));
    }).catch(function (err) {
      response.send(common.response(err.code, err.message, false));
    });
});

router.post('/updatenumberinvoice', common.isAuthenticate, function (request, response) {
  models.Orderbook.update({
    numberinvoice: request.body.numberinvoice,
  }, {
      where: { id: request.body.id }
    }).then(function (res) {
      response.send(common.response(res, "Se guardo correctamente"));
    }).catch(function (err) {
      response.send(common.response(err.code, err.message, false));
    });
});

router.get('/', common.isAuthenticate, function (request, response) {
  models.Orderbook.findAll({
    include: [models.Office]
  }).then(function (res) {
    response.send(common.response(res));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});

router.post('/getbyid', common.isAuthenticate, function (request, response) {
  models.Orderbook.findOne({
    where: { id: request.body.id }
  }).then(function (res) {
    response.send(common.response(res));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});

router.post('/getbystatusandtype', common.isAuthenticate, function (request, response) {
  models.Orderbook.findOne({
    where: { status: request.body.status, type: request.body.type }
  }).then(function (res) {
    response.send(common.response(res));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});

router.post('/getbynumberinvoiceandnumberorder', common.isAuthenticate, function (request, response) {
  models.Orderbook.findOne({
    where: { numberorder: request.body.numberorder, numberinvoice: request.body.numberinvoice }
  }).then(function (res) {
    response.send(common.response(res));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});

router.post('/destroy', common.isAuthenticate, function (request, response) {
  models.Orderbook.destroy({
    where: { id: request.body.id }
  }).then(function () {
    response.send(common.response("", "Se elimino correctamente"));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});

module.exports = router;