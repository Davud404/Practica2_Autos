'use strict';
var models = require('../models');
var cliente = models.cliente;

class ClienteControl{
    async listar(req, res) {
        var lista = await cliente.findAll({
            attributes: ['nombres', 'apellidos', 'celular', 'dni','direccion', ['external_id', 'id']], //para que solo muestre los atributos que le envíes
        });
        res.status(200);
        res.json({ msg: "OK", code: 200, datos: lista });
    }

    async obtener(req, res) {
        const external = req.params.external;
        if(external === null || external === undefined){
            res.status(400);
            res.json({ msg: "Error", tag: "Hace falta un external id", code: 400 });
        }else{
            var lista = await cliente.findOne({
                where: { external_id: external },
                attributes: ['nombres', 'apellidos', 'celular', 'dni','direccion', ['external_id', 'id']]
            });
            if (lista === undefined || lista == null) {
                res.status(200);
                res.json({ msg: "No hay nada", code: 200, datos: {} });
            } else {
                res.status(200);
                res.json({ msg: "OK", code: 200, datos: lista });
            }
        }

    }

    async guardar(req, res) {
        if (req.body.hasOwnProperty('nombres') &&
        req.body.hasOwnProperty('apellidos') &&
        req.body.hasOwnProperty('celular') &&
        req.body.hasOwnProperty('dni') &&
        req.body.hasOwnProperty('direccion')) {//Valida que el nombre del atributo del body esté bien
            var uuid = require('uuid');
            var data = {
                apellidos: req.body.apellidos,
                nombres: req.body.nombres,
                direccion: req.body.direccion,
                celular: req.body.celular,
                dni: req.body.dni,
                external_id: uuid.v4()
            }
            var result = await cliente.create(data);
            if (result === null) {
                res.status(401);
                res.json({ msg: "Error", tag: "No se creó el cliente", code: 401 });
            } else {
                res.status(200);
                res.json({ msg: "OK", code: 200 });
            }
        } else {
            res.status(400);
            res.json({ msg: "Error", tag: "Faltan datos o el nombre del atributo está mal", code: 400 });
        }
    }
}
module.exports = ClienteControl;