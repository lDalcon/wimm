// ============================================================================================
// Requires -> Importacion de librerias
// ============================================================================================

var express = require('express');
var Medico = require('../models/medico');
var mdAutenticacion = require('../middlewares/autenticacion');

// ============================================================================================
// Inicializar variable
// ============================================================================================

var app = express();

// ============================================================================================
// Obtener Medicos
// ============================================================================================

app.get("/", (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({}, 'nombre img usuario medico')
        .skip(desde)
        .limit(5)
        .populate('hospital')
        .populate('usuario', 'nombre email')
        .exec((err, medicos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando medicos',
                    errors: err
                });
            }

            Medico.count({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    medicos: medicos,
                    total: conteo
                });
            });
        })
});

// ============================================================================================
// Fin --> Obtener Medicos
// ============================================================================================

// ============================================================================================
// Crear nuevo medico
// ============================================================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
            usuarioToken: req.usuario.nombre
        });

    });

});

// ============================================================================================
// Fin -->Crear nuevo Medico
// ============================================================================================
// ============================================================================================
// Actualizar Medico
// ============================================================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medico) {
            res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + 'no existe',
                errors: { message: 'No existe un medico con ese ID' }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            };

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    });
});

// ============================================================================================
// Fin --> Actualizar medico
// ============================================================================================
// ============================================================================================
// Borrar medico por el id
// ============================================================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndDelete(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El medico no pudo ser eliminado',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico no existe',
                errors: { message: 'El medico no existe' }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });

});

// ============================================================================================
// Fin --> Borrar usuario
// ============================================================================================



module.exports = app;