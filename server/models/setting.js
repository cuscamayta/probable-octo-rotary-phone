"use strict";

module.exports = function (sequelize, DataTypes) {
    var Setting = sequelize.define("Setting", {
        title: { type: DataTypes.STRING, allowNull: false },
        numberid: { type: DataTypes.STRING, allowNull: false, unique: true },
        note: { type: DataTypes.TEXT, allowNull: false },
    });
    return Setting;
};