'use strict';
var models = require('../models');
var empleado = models.empleado;
var rol = models.rol;
var cuenta = models.cuenta;
let jwt = require('jsonwebtoken');
class CuentaControl {
    //npm install jsonwebtoken --save 
    //npm install dotenv --save
    async inicio_sesion(req, res){ //Inicio de sesión es post
        console.log(req.body);
        if(req.body.hasOwnProperty('correo') &&
        req.body.hasOwnProperty('clave')){
            let cuentaA = await cuenta.findOne({
                where:{correo:req.body.correo},
                include:[
                    {model: models.empleado, as:"empleado", attributes: ['nombres','apellidos', 'id_rol']}
                ]
            });
            if(cuentaA === null || cuentaA === undefined){
                res.status(400);
                res.json({msg:"ERROR", tag:"La cuenta no existe", code:400});
            }else{
                if(cuentaA.estado == true){
                    if(cuentaA.clave === req.body.clave){
                        var rolAux = await rol.findOne({ where: { id: cuentaA.empleado.id_rol } });
                        const token_data ={
                            external: cuentaA.external_id,
                            rol: rolAux.nombre,
                            check:true
                        };
                        require('dotenv').config();
                        const key = process.env.TWICE //Esta es la llave guardada en el env y puede tener cualquier nombre
                        //Escoger uno que no sea tan obvio
                        const token = jwt.sign(token_data, key,{//Encripta el token_data con el abecedario que se le dio (key)
                            expiresIn: '2h'//tiempo de expiración del token
                        });
                        var uuid = require('uuid');
                        var info = {
                            token: token,
                            user: cuentaA.empleado.nombres+' '+cuentaA.empleado.apellidos,
                            rol: rolAux.nombre,
                            external: uuid.v4()
                        };
                        res.status(200);
                        res.json({msg:"OK", tag:"Ha iniciado sesión", code:200, data:info});
                    }else{
                        res.status(400);
                        res.json({msg:"ERROR", tag:"El correo o clave están incorrectos", code:400});
                    }
                }else{
                    res.status(400);
                    res.json({msg:"ERROR", tag:"La cuenta no está activa", code:400});
                }
            }
        }else{
            res.status(400);
            res.json({msg:"ERROR", tag:"Faltan datos", code:400});
        }
    }
}
module.exports = CuentaControl;