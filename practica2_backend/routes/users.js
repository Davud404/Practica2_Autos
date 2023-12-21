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

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Práctica 2');
});

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
router.post('/admin/autos/guardar', autoControl.guardar);
router.post('/admin/autos/file/save/:external', autoControl.guardarFoto);
router.patch('/admin/autos/modificar/:external', autoControl.modificar);
//api ventas
router.get('/admin/ventas', ventaControl.listar);
router.get('/admin/ventas/:external', ventaControl.obtener);
router.post('/admin/ventas/nueva_venta', ventaControl.realizarVenta);

module.exports = router;