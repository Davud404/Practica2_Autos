'use strict';

module.exports = (sequelize, DataTypes) =>{
    const venta = sequelize.define('venta',{ //Primero el nombre de la clase y entre llaves sus atributos
        fecha: {type: DataTypes.DATE, defaultValue:DataTypes.NOW},
        total: {type: DataTypes.DOUBLE, defaultValue:0.0},
        recargo: {type: DataTypes.DOUBLE, defaultValue:0.0},
        external_id:{type:DataTypes.UUID, defaultValue: DataTypes.UUIDV4}
    },{freezeTableName: true});
    venta.associate = function(models){
        venta.belongsTo(models.empleado,{foreignKey:'id_empleado'});
        venta.belongsTo(models.auto, { foreignKey: 'id_auto' });
        venta.belongsTo(models.cliente, { foreignKey: 'id_cliente' });
    }
    return venta;
}