var models = require('./../models');
var express = require('express');
var router = express.Router();
var common = require('./common');

router.post('/create', common.isAuthenticate, function (request, response) {
  return models.sequelize.transaction(function (t) {
    return models.Schedule.create({
      dateregister: request.body.dateregister,
      price: request.body.price,
      arrival: request.body.arrival,
      departure: request.body.departure,
      detail: request.body.detail,
      idbus: request.body.idbus,
      idtravel: request.body.idtravel
    }, { transaction: t }).then(function (res) {
      for (var i = 0; i < request.body.details.length; i++) {
        return models.Scheduledetail.create({
          drivertype: request.body.details[i].drivertype,
          iddriver: request.body.details[i].iddriver,
          idschedule: res.id
        }), { transaction: t };
      }
    });
  }).then(function (res) {
    response.send(common.response(null, "Se guardo correctamente"));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});


router.post('/update', common.isAuthenticate, function (request, response) {
  return models.sequelize.transaction(function (t) {
    return models.Schedule.update({
      dateregister: request.body.dateregister,
      price: request.body.price,
      arrival: request.body.arrival,
      departure: request.body.departure,
      detail: request.body.detail,
      idbus: request.body.idbus,
      idtravel: request.body.idtravel
    }, { where: { id: request.body.id } }, { transaction: t }).then(function (res) {
      for (var i = 0; i < request.body.details.length; i++) {
        if (request.body.details[i].state == 1) {
          return models.Scheduledetail.create({
            drivertype: request.body.details[i].drivertype,
            iddriver: request.body.details[i].iddriver,
            idschedule: request.body.id
          }), { transaction: t };
        }
        if (request.body.details[i].state == 0) {
          return models.Scheduledetail.destroy({
            where: { id: request.body.details[i].id }
          }), { transaction: t };
        }
      }
    });
  }).then(function (res) {
    response.send(common.response(null, "Se guardo correctamente"));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});

router.get('/', common.isAuthenticate, function (request, response) {
  models.Schedule.findAll({
    include: [{ model: models.Scheduledetail, include: [models.Driver] }, { model: models.Bus }, { model: models.Travel }]
  }).then(function (res) {
    response.send(common.response(res));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});

router.post('/forselect', common.isAuthenticate, function (request, response) {
  models.Schedule.findAll({
    include: [{ model: models.Bus }, { model: models.Ticket, where: { status: 1 }, required: false }], where: { idtravel: request.body.id },
    order: 'dateregister DESC'
  }).then(function (res) {
    response.send(common.response(res));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});

router.post('/destroy', common.isAuthenticate, function (request, response) {
  return models.sequelize.transaction(function (t) {
    return models.Scheduledetail.destroy({
      where: { idschedule: request.body.id }
    }, { transaction: t }).then(function (res) {
      return models.Schedule.destroy({
        where: { id: request.body.id }
      }), { transaction: t };
    });
  }).then(function (res) {
    response.send(common.response(null, "Se elimino correctamente"));
  }).catch(function (err) {
    response.send(common.response(err.code, err.message, false));
  });
});

module.exports = router;