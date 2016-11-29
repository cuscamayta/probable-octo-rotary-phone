"use strict";

var moment = require("moment");
var common = require('../routes/common');

module.exports = function (sequelize, DataTypes) {
    var Schedule = sequelize.define("Schedule", {
        dateregister: {
            type: DataTypes.DATE, allowNull: false,
            set: function (val) {
                this.setDataValue('dateregister', common.formatDate(val));
            },
            get: function (val) {
                var date = this.getDataValue('dateregister');
                return moment(date).format("DD/MM/YYYY");
            }
        },
        price: { type: DataTypes.DECIMAL, allowNull: false },
        arrival: { type: DataTypes.STRING, allowNull: false },
        departure: { type: DataTypes.STRING, allowNull: false },
        detail: { type: DataTypes.STRING, allowNull: true }
    },
        {
            classMethods: {
                associate: function (models) {
                    Schedule.belongsTo(models.Bus, { foreignKey: "idbus" });
                    Schedule.belongsTo(models.Travel, { foreignKey: "idtravel" });
                    Schedule.hasMany(models.Scheduledetail, { foreignKey: "idschedule" });
                    Schedule.hasMany(models.Ticket, { foreignKey: "idschedule" });
                    Schedule.hasMany(models.Sale, { foreignKey: "idschedule" });
                }
            }
        }
    );
    return Schedule;
};