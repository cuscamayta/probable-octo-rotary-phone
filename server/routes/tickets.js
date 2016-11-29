var models = require('./../models');
var express = require('express');
var router = express.Router();
var common = require('./common');
var invoice = require('./codecontrol');
var moment = require("moment");

function createsalesbook(request, codecontrol, numberinvoice, numberorder, typeorder, idorderbook) {
    return {
        type: typeorder,
        numberorder: numberorder,
        numbercontrol: codecontrol,
        numberid: request.body.numbernitinvoice,
        fullname: request.body.nameinvoice,
        numberinvoice: numberinvoice,
        dateregister: request.body.dateregister,
        amountinvoice: request.body.amountinvoice,
        amountinvoiceice: 0,
        amountinvoiceexento: 0,
        amountinvoicenet: (request.body.amountinvoice - (request.body.amountinvoice * 0.13)),
        amountoftax: (request.body.amountinvoice * 0.13),
        status: 1,
        idoffice: request.body.idoffice,
        idorderbook: idorderbook
    };
}

function createsale(request, salebook) {
    return {
        dateregister: request.body.dateregister,
        arrival: request.body.arrival,
        departure: request.body.departure,
        total: request.body.amountinvoice,
        detail: request.body.detail,
        status: 1,
        idsalesbook: salebook.id,
        idschedule: request.body.idschedule,
        iduser: request.body.iduser,
        idoffice: request.body.idoffice,
    };
}

function createticket(request, index, sale) {
    return {
        numberid: request.body.details[index].numberid,
        fullname: request.body.details[index].fullName,
        price: request.body.details[index].price,
        number: request.body.details[index].numberseat,
        numberbaggage: request.body.details[index].numberbaggage,
        weightbaggage: request.body.details[index].weightbaggage,
        status: 1,
        idbus: request.body.details[index].idbus,
        idschedule: request.body.details[index].idschedule,
        iduser: request.body.iduser,
        idoffice: request.body.idoffice,
        idsale: sale.id
    };
}

function createdetailsales(request, index, ticket, sale) {
    return {
        price: request.body.details[index].price,
        number: request.body.details[index].numberseat,
        detail: request.body.details[index].detail,
        status: 1,
        idticket: ticket.id,
        idsale: sale.id
    };
}

function getcodecontrol(request, numberorder, numberinvoice, numbernit, controlkey) {
    var dateinvoice = request.body.dateregister.split("/")[2] + request.body.dateregister.split("/")[1] + request.body.dateregister.split("/")[0];

    return invoice.generateControlCode(
        numberorder, numberinvoice, numbernit, dateinvoice, request.body.amountinvoice, controlkey
    );
}

function getdatesinvoice(orderbook, request) {
    return {
        deadline: orderbook.deadline.split("/")[2] + "/" + orderbook.deadline.split("/")[1] + "/" + orderbook.deadline.split("/")[0],
        datecurrent: request.body.dateregister.split("/")[2] + "/" + request.body.dateregister.split("/")[1] + "/" + request.body.dateregister.split("/")[0]
    }
}

router.post('/create', common.isAuthenticate, function (request, response) {

    return models.sequelize.transaction(function (t) {

        return models.Setting.findOne({ transaction: t }).then(function (setting) {
            return models.Orderbook.findOne({ where: { idoffice: request.body.idoffice, status: 2, type: 1 } }, { transaction: t }).then(function (orderbook) {
                if (orderbook) {
                    var datesInvoice = getdatesinvoice(orderbook, request);
                    if (moment(datesInvoice.datecurrent).isAfter(datesInvoice.deadline)) {
                        throw new Error("Libro de ordenes vencido");
                    } else {
                        return models.Salesbook.max('numberinvoice', { where: { numberorder: orderbook.numberorder } }, { transaction: t }).then(function (nroinvoice) {
                            if (!nroinvoice) nroinvoice = 0
                            var numberinvoice = (nroinvoice + 1), controlcode = getcodecontrol(request, orderbook.numberorder, numberinvoice, setting.numberid, orderbook.controlkey);

                            return models.Salesbook.create(createsalesbook(request, controlcode, numberinvoice, orderbook.numberorder, orderbook.type, orderbook.id), { transaction: t }).then(function (salebook) {
                                return models.Sale.create(createsale(request, salebook), { transaction: t }).then(function (sale) {
                                    var ticketpromises = [];

                                    for (var i = 0; i < request.body.details.length; i++) {
                                        var ticketpromise = models.Ticket.create(createticket(request, i, sale), { transaction: t });
                                        ticketpromises.push(ticketpromise);
                                    }

                                    return Promise.all(ticketpromises).then(function (tickets) {
                                        var salesdetailpromises = [];
                                        for (var i = 0; i < tickets.length; i++) {

                                            var salesdetailpromise = models.Salesdetail.create(createdetailsales(request, i, tickets[i].dataValues, sale), { transaction: t });
                                            salesdetailpromises.push(salesdetailpromise, { transaction: t });
                                        }
                                        return Promise.all(salesdetailpromises);
                                    });
                                });
                            });
                        });
                    }
                } else {
                    throw new Error("No existe libro de orden");
                }
            });
        });

    }).then(function (result) {
        response.send(common.response(null, "Se guardo correctamente"));
    }).catch(function (err) {
        response.send(common.response(err.code, err.message, false));
    });
});

router.get('/', common.isAuthenticate, function (request, response) {
    models.Sale.findAll({
        where: { status: 1 }
    }).then(function (res) {
        response.send(common.response(res));
    }).catch(function (err) {
        response.send(common.response(err.code, err.message, false));
    });
});

router.post('/invalidate', common.isAuthenticate, function (request, response) {

    return models.sequelize.transaction(function (t) {

        var nro = request.body.id;

        return models.Salesbook.update({ status: 0 }, { where: { id: request.body.id } }, { transaction: t }).then(function (salebook) {
            return models.Sale.findOne({ where: { idsalesbook: request.body.id } }, { transaction: t }).then(function (sale) {
                return models.Sale.update({ status: 0 }, { where: { idsalesbook: request.body.id } }, { transaction: t }).then(function () {
                    return models.Salesdetail.update({ status: 0 }, { where: { idsale: sale.id } }, { transaction: t }).then(function () {
                        return models.Ticket.update({ status: 0 }, { where: { idsale: sale.id } }, { transaction: t }).then(function () {
                        });
                    });
                });
            });
        });

    }).then(function (result) {
        response.send(common.response(null, "Se anulo correctamente"));
    }).catch(function (err) {
        response.send(common.response(err.code, err.message, false));
    });
});

router.post('/formanifest', common.isAuthenticate, function (request, response) {
    models.Ticket.findAll({
        include: [{ model: models.Bus }, { model: models.Schedule }], where: { idschedule: request.body.id, status: 1 },
        order: 'number ASC'
    }).then(function (res) {
        response.send(common.response(res));
    }).catch(function (err) {
        response.send(common.response(err.code, err.message, false));
    });
});

module.exports = router;