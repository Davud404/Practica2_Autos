'use strict';

module.exports = (sequelize, DataTypes) =>{
    const auto = sequelize.define('auto',{ //Primero el nombre de la clase y entre llaves sus atributos
        marca: {type: DataTypes.STRING(100), defaultValue:"NONE"},
        descripcion: {type: DataTypes.TEXT, defaultValue:"NONE"},
        precio: {type: DataTypes.DOUBLE, defaultValue:0.0},
        img: {type: DataTypes.STRING(150), defaultValue:"imagen.png"},
        color :{type: DataTypes.ENUM('AZUL', 'AMARILLO', 'ROJO', 'VERDE', 'NEGRO', 'DORADO', 'MORADO', 'BLANCO', 'PLATA')},
        external_id:{type:DataTypes.UUID, defaultValue: DataTypes.UUIDV4}
    },{freezeTableName: true});
    auto.associate = function(models){
        auto.hasMany(models.venta, { foreignKey: 'id_auto', as: 'venta' });
    }
    return auto;
}