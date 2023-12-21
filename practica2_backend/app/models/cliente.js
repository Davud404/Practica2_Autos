'use strict';

module.exports = (sequelize, DataTypes) =>{
    const cliente = sequelize.define('cliente',{ //Primero el nombre de la clase y entre llaves sus atributos
        apellidos: {type: DataTypes.STRING(150), defaultValue:"NONE"},
        nombres: {type: DataTypes.STRING(150), defaultValue:"NONE"},
        celular: {type: DataTypes.STRING(20), defaultValue:"NONE"},
        dni: {type: DataTypes.STRING(20), defaultValue:"NONE"},
        direccion: {type: DataTypes.STRING(150), defaultValue:"NONE"},
        external_id:{type:DataTypes.UUID, defaultValue: DataTypes.UUIDV4}
    },{freezeTableName: true}); //para que la tabla tome el nombre que nosotros le damos
    cliente.associate = function(models){
        cliente.hasMany(models.venta,{foreignKey:'id_cliente', as:'venta'});
    }
    return cliente;
}