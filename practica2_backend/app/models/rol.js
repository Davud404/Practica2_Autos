'use strict';

module.exports = (sequelize, DataTypes) =>{
    const rol = sequelize.define('rol',{ //Primero el nombre de la clase y entre llaves sus atributos
        nombre: {type: DataTypes.STRING(100)},
        external_id:{type:DataTypes.UUID, defaultValue: DataTypes.UUIDV4}
    },{timestamps:false, freezeTableName: true});
    rol.associate = function(models){
        rol.hasMany(models.empleado,{foreignKey:'id_rol', as:'empleado'}); //relacion 1 a muchos
    }
    return rol;
}