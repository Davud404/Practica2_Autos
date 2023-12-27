var express = require('express');
var router = express.Router();
const clienteC = require('../app/controls/ClienteControl');
let clienteControl = new clienteC();
const rolC = require('../app/controls/RolControl');
let rolControl = new rolC();
const empleadoC = require('../app/controls/EmpleadoControl');
let empleadoControl = new empleadoC();
const autoC = require('../app/controls/AutoControl');
let autoControl = new autoC();
const ventaC = require('../app/controls/VentaControl');
let ventaControl = new ventaC();
const cuentaC = require('../app/controls/CuentaControl');
let cuentaControl = new cuentaC();
let jwt = require('jsonwebtoken');
const models = require('../app/models');
const cuenta = models.cuenta;
const rol = models.rol;

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('Práctica 2');
});
//middleware
const authGerente = function middleware(req, res, next) {
  const token = req.headers['token'];//Como quiero que se llame
  if (token === undefined) {
    res.status(401);
    res.json({ msg: "ERROR", tag: "Falta token", code: 401 });
  } else {
    require('dotenv').config();
    const key = process.env.TWICE;
    jwt.verify(token, key, async (err, decoded) => {
      if (err) {
        res.status(401);
        res.json({ msg: "ERROR", tag: "Token no válido o expirado", code: 401 });
      } else {
        let aux = await cuenta.findOne({
          where: { external_id: decoded.external },
          include: [
            { model: models.empleado, as: "empleado", attributes: ['nombres', 'apellidos', 'id_rol'] }
          ]
        });
        if (aux === null) {
          res.status(401);
          res.json({ msg: "ERROR", tag: "Token no válido", code: 401 });
        } else {
          var rolAux = await rol.findOne({ where: { id: aux.empleado.id_rol } });
          if(rolAux.nombre == "Gerente"){
            next();
          }else{
            res.status(401);
          res.json({ msg: "ERROR", tag: "Solo el gerente puede acceder a esta URL", code: 401 });
          }
        }

      }
    });
  }
  //console.log(token);
  //console.log(req);
  //next();
}
//inicio de sesion
router.post('/login', cuentaControl.inicio_sesion);
//api clientes
router.get('/admin/clientes', clienteControl.listar);
router.post('/admin/clientes/guardar', clienteControl.guardar);
router.get('/admin/clientes/get/:external', clienteControl.obtener);
//api roles
router.get('/admin/roles', rolControl.listar);
router.post('/admin/roles/guardar', rolControl.guardar);
//api empleados
router.get('/admin/empleados', empleadoControl.listar);
router.post('/admin/empleados/guardar', empleadoControl.guardar);
router.patch('/admin/empleados/modificar/:external', empleadoControl.modificar);
router.get('/admin/empleados/get/:external', empleadoControl.obtener);
//api autos
router.get('/admin/autos', autoControl.listar);
router.post('/admin/autos/guardar', authGerente, autoControl.guardar);
router.post('/admin/autos/file/save/:external',authGerente, autoControl.guardarFoto);
router.patch('/admin/autos/modificar/:external',authGerente, autoControl.modificar);
//api ventas
router.get('/admin/ventas', ventaControl.listar);
router.get('/admin/ventas/:external', ventaControl.obtenerPorMes);
router.post('/admin/ventas/nueva_venta', ventaControl.realizarVenta);

module.exports = router;