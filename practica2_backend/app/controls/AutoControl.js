'use strict';
var models = require('../models');
var formidable = require('formidable');//Librería para poder subir archivos -> npm install formidable --save
var fs = require('fs');//Acceder al sistema operativo del servidor para agregar el archivo
var auto = models.auto;
var extensiones = ['jpg', 'png', 'jpeg'];
const tamanioMax = 2 * 1024 * 1024;

class AutoControl {

    async listar(req, res) {
        var lista = await auto.findAll({
            attributes: ['marca', 'descripcion', 'precio', 'img', 'color', 'external_id'],
        });
        res.status(200);
        res.json({ msg: "OK", code: 200, datos: lista });
    }
    /*
    async obtener(req, res) {
        const external = req.params.external;
        var lista = await empleado.findOne({
            where: { external_id: external },
            attributes: ['nombres', 'apellidos', 'celular'],
            include: [
                { model: models.cuenta, as: 'cuenta', attributes: ['correo'] },
                { model: models.rol, as: 'rol', attributes: ['nombre'] }
            ]
        });
        if (lista === undefined || lista == null) {
            res.status(200);
            res.json({ msg: "No existe ese empleado", code: 200, datos: {} });
        } else {
            res.status(200);
            res.json({ msg: "OK", code: 200, datos: lista });
        }

    }*/

    async guardar(req, res) {
        if (req.body.hasOwnProperty('marca') &&
            req.body.hasOwnProperty('descripcion') &&
            req.body.hasOwnProperty('precio') &&
            req.body.hasOwnProperty('color')) {
            var uuid = require('uuid');
            var data = {
                marca: req.body.marca,
                descripcion: req.body.descripcion,
                precio: req.body.precio,
                color: req.body.color,
                img: "imagen.png",
                external_id: uuid.v4()
            }
            var result = await auto.create(data);
            if (result === null) {
                res.status(401);
                res.json({ msg: "Error", tag: "No se creó el auto", code: 401 });
            } else {
                res.status(200);
                res.json({ msg: "OK", code: 200 });
            }

        } else {
            res.status(400);
            res.json({ msg: "Error", tag: "Faltan datos", code: 400 });
        }
    }

    async guardarFoto(req, res) {
        const externalAuto = req.params.external;
        var form = new formidable.IncomingForm(), files = [];
        form.on('file', function (field, file) {//Siempre enviar este dato como file en el formulario, si es archivo, acá también será archivo inputFile
            files.push(file);
        }).on('end', function () {
            console.log('OK');
        });
        form.parse(req, function (err, fields) {
            let listado = files;
            //let body = JSON.parse(fields);
            let external = fields.external[0];
            for (let index = 0; index < listado.length; index++) {
                var file = listado[index];
                //validación del tamaño y tipo de archivo
                var extension = file.originalFilename.split('.').pop().toLowerCase();//Sacar el nombre original del archivo (archivo.png), separa en puntos y los pone en pilas. Saca la primera posición que sería el formato del archivo
                if (file.size > tamanioMax) {
                    res.status(400);
                    res.json({ msg: "ERROR", tag: "El tamaño del archivo supera los 2MB ", code: 400 });
                } else {
                    if (extensiones.includes(extension)) {
                        const name = external + '.' + extension;//Dándole al archivo un nombre específico
                        fs.rename(file.filepath, "public/multimedia/" + name, async function (err) {//guardar el archivo en la carpeta
                            if (err) {
                                res.status(400);
                                console.log(err);
                                res.json({ msg: "Error", tag: "No se pudo guardar el archivo", code: 400});
                            } else {
                                await auto.update({img:name},{where:{external_id:externalAuto}});
                                res.status(200);
                                res.json({ msg: "OK", tag: "Imagen guardada", code: 200 });
                                
                            }
                        });
                    } else {
                        res.status(400);
                        res.json({ msg: "ERROR", tag: "Solo soporta " + extensiones, code: 400 });
                    }
                }

            }
        });

    }

    async modificar(req, res) {
        const external = req.params.external;
        var car = await auto.findOne({where: { external_id: external }});

        if (car == undefined || car == null) {
            res.status(200).json({ msg: "No existe ese auto", code: 200 });
        } else {
            try {
                var uuid = require('uuid');
                const data = {
                    marca: req.body.marca !== undefined ? req.body.marca : car.marca,
                    descripcion: req.body.descripcion !== undefined ? req.body.descripcion : car.descripcion,
                    precio: req.body.precio !== undefined ? req.body.precio : car.precio,
                    color: req.body.color !== undefined ? req.body.color : car.color,
                    external_id: uuid.v4()
                };
                await car.update(data);
                res.status(200).json({ msg: "Auto modificado", code: 200 });
            } catch (error) {
                res.status(500).json({ msg: "Error interno del servidor", code: 500, error_msg: error.message });
            }
        }

    }
}
module.exports = AutoControl; //Exportar la clase