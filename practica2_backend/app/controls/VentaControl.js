'use strict';
var models = require('../models');
const moment = require('moment');
const { Op } = require('sequelize');
var venta = models.venta;
var empleado = models.empleado;
var cliente = models.cliente;
var auto = models.auto;

class VentaControl {

    async listar(req, res) {
        var lista = await venta.findAll({
            attributes: ['fecha', 'recargo', 'total', 'external_id'],
            include: [
                { model: models.empleado, as: 'empleado', attributes: ['nombres','apellidos'] },
                { model: models.cliente, as: 'cliente', attributes: ['nombres','apellidos'] },
                { model: models.auto, as: 'auto', attributes: ['marca','descripcion','precio'] }
            ]
        });
        res.status(200);
        res.json({ msg: "OK", code: 200, datos: lista });
    }

    async obtenerPorMes(req, res) {
        const external = req.params.external;
        const fechaInicio = moment(external, 'YYYY-MM').startOf('month').toDate();
        const fechaFin = moment(external, 'YYYY-MM').endOf('month').toDate();
    
        try {
            const lista = await venta.findAll({
                where: {
                    fecha: {
                        [Op.between]: [fechaInicio, fechaFin]
                    }
                },
                attributes: ['fecha', 'recargo', 'total', 'external_id'],
                include: [
                    { model: models.empleado, as: 'empleado', attributes: ['nombres', 'apellidos'] },
                    { model: models.cliente, as: 'cliente', attributes: ['nombres', 'apellidos'] },
                    { model: models.auto, as: 'auto', attributes: ['marca', 'descripcion', 'precio'] }
                ]
            });
    
            if (!lista || lista.length === 0) {
                res.status(200);
                res.json({ msg: "No existen ventas en ese mes", code: 200, datos: [] });
            } else {
                res.status(200);
                res.json({ msg: "OK", code: 200, datos: lista });
            }
        } catch (error) {
            res.status(500);
            res.json({ msg: "Error interno del servidor", code: 500, error_msg: error.message });
        }
    }
    

    async realizarVenta(req, res) {
        if (req.body.hasOwnProperty('fecha') &&
            req.body.hasOwnProperty('total') &&
            req.body.hasOwnProperty('empleado') &&
            req.body.hasOwnProperty('cliente') &&
            req.body.hasOwnProperty('auto')) {
            var uuid = require('uuid');
            var emplead = await empleado.findOne({
                where: { external_id: req.body.empleado },
                include: [{ model: models.rol, as: "rol", attributes: ['nombre'] }], //Para enviar el rol del empleado
            });
            if (emplead == undefined || emplead == null) {
                res.status(401);
                res.json({ msg: "Error", tag: "No se encontró al vendedor", code: 401 });
            } else {
                var client = await cliente.findOne({where: { external_id: req.body.cliente }});
                if(client == undefined || client == null){
                    res.status(401);
                    res.json({ msg: "Error", tag: "No se encontró al cliente", code: 401 });
                }else{
                    var aut = await auto.findOne({where: { external_id: req.body.auto }});
                    if(aut == undefined || aut == null){
                        res.status(401);
                        res.json({ msg: "Error", tag: "No se encontró el auto", code: 401 });
                    }else{
                        var recargoAux = 0;
                        var totalAux = 0;
                        if(aut.color == "BLANCO" || aut.color == "PLATA"){
                            totalAux = req.body.total;
                        }else{
                            recargoAux = req.body.total * 0.05;
                            totalAux = req.body.total + recargoAux;
                        }
                        var data = {
                            fecha: req.body.fecha,
                            total: totalAux,
                            recargo: recargoAux,
                            id_empleado: emplead.id,
                            id_cliente: client.id,
                            id_auto: aut.id,
                            external_id: uuid.v4()
                        }
        
                        if (emplead.rol.nombre == 'Vendedor') { //Para que verifique si la persona es un editor
                            var result = await venta.create(data);
                            if (result === null) {
                                res.status(401);
                                res.json({ msg: "Error", tag: "No se realizó la venta", code: 401 });
                            } else {
                                emplead.external_id = uuid.v4();
                                client.external_id = uuid.v4();
                                aut.external_id = uuid.v4();
                                await emplead.save();
                                await client.save();
                                await aut.save();
                                res.status(200);
                                res.json({ msg: "OK", tag:"Venta realizada", code: 200 });
                            }
                        } else {
                            res.status(400);
                            res.json({ msg: "Error", tag: "La persona que realiza la venta no es un vendedor", code: 400 });
                        }
                    }
                }

            }
        } else {
            res.status(400);
            res.json({ msg: "Error", tag: "Faltan datos", code: 400 });
        }
    }
}
module.exports = VentaControl; //Exportar la clase