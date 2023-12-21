'use strict';

module.exports = (sequelize, DataTypes) =>{
    const empleado = sequelize.define('empleado',{ //Primero el nombre de la clase y entre llaves sus atributos
        apellidos: {type: DataTypes.STRING(150), defaultValue:"NONE"},
        nombres: {type: DataTypes.STRING(150), defaultValue:"NONE"},
        celular: {type: DataTypes.STRING(20), defaultValue:"NONE"},
        external_id:{type:DataTypes.UUID, defaultValue: DataTypes.UUIDV4}
    },{freezeTableName: true}); //para que la tabla tome el nombre que nosotros le damos
    empleado.associate = function(models){
        empleado.hasOne(models.cuenta,{foreignKey:'id_empleado', as:'cuenta'});
        empleado.belongsTo(models.rol,{foreignKey:'id_rol'});
        empleado.hasMany(models.venta,{foreignKey:'id_empleado', as:'venta'});
    }
    return empleado;
}