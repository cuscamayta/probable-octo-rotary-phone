var models = require('./../models');
var express = require('express');
var router = express.Router();
var common = require('./common');
var jwt = require("jsonwebtoken");

router.post('/authenticate', function(req, res) {

    models.User.findOne({
        attributes: ["id", "username", "firstname", "lastname", "password", "idrole", "token"],
        include: [{ model: models.Role, attributes: ["title"] }],
        where: { username: req.body.username, password: req.body.password }
    }).then(function(user) {
        if (user) {
            models.Permit.findAll({
                attributes: ["idpage"],
                include: [{ model: models.Page, attributes: ["title", "path", "idmodule"], include: [{ model: models.Module, attributes: ["title", "class"] }] }],
                where: { idrole: user.dataValues.idrole },
                order: ["idmodule", "idpage"]
            }).then(function(permit) {
                if (permit) {
                    models.Useroffice.findAll({
                        attributes: ["idoffice"],
                        include: [{ model: models.Office, attributes: ["title"] }],
                        where: { iduser: user.dataValues.id }, order: "title"
                    }).then(function(offices) {
                        if (offices) {
                            res.json({ type: true, user: user.dataValues, permits: permit, offices: offices });
                        }
                        else {
                            res.json({
                                type: false,
                                data: "Usuario no tiene sucursales asignados"
                            });
                        }
                    }).catch(function(err) { throw new Error(err); });
                }
                else {
                    res.json({
                        type: false,
                        data: "Usuario no tiene permisos asignados"
                    });
                }
            }).catch(function(err) { throw new Error(err); });
        }
        else {
            res.json({
                type: false,
                data: "Usuario o contraseña incorretos"
            });
        }
    }).catch(function(err) {
        res.json({
            type: false,
            data: "Error : " + err
        });
    });
});

router.post('/changepass', common.isAuthenticate, function(req, res) {

    models.User.findOne({
        attributes: ["password"],
        where: { username: req.body.username, password: req.body.passcurrent }
    }).then(function(user) {
        if (user) {
            models.User.update({ password: req.body.passnew }, {
                where: { username: req.body.username, password: req.body.passcurrent }
            }).then(function(change) {
                if (change) {
                    res.json({
                        type: true,
                        data: "Se actualizo correctamente"
                    });
                } else {
                    res.json({
                        type: false,
                        data: "No se pudo actualizar la contraseña"
                    });
                }
            }).catch(function(err) {
                res.json({
                    type: false,
                    data: "Error : " + err
                });
            });
        }
        else {
            res.json({
                type: false,
                data: "Contraseña anterior incorrecta"
            });
        }
    }).catch(function(err) {
        res.json({
            type: false,
            data: "Error : " + err
        });
    });
});

module.exports = router;