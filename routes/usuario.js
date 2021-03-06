// ============================================================================================
// Requires -> Importacion de librerias
// ============================================================================================

var express = require('express');
var bcrypt = require('bcryptjs');
var Usuario = require('../models/usuario');
var mdAutenticacion = require('../middlewares/autenticacion');

// ============================================================================================
// Inicializar variable
// ============================================================================================

var app = express();

// ============================================================================================
// Obtener usuarios
// ============================================================================================

app.get("/", (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role')
        .skip(desde)
        .limit(5)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuario',
                    errors: err
                });
            }

            Usuario.count({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    usuarios: usuarios,
                    total: conteo
                });
            });

        })
});

// ============================================================================================
// Fin --> Obtener usuarios
// ============================================================================================

// ============================================================================================
// Crear nuevo usuario
// ============================================================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        img: body.img
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario.nombre
        });

    });

});

// ============================================================================================
// Fin -->Crear nuevo usuario
// ============================================================================================
// ============================================================================================
// Actualizar usuario
// ============================================================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + 'no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            };

            usuarioGuardado.password = ''

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});

// ============================================================================================
// Fin --> Actualizar usuario
// ============================================================================================
// ============================================================================================
// Borrar usuario por el id
// ============================================================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El usuario no pudo ser eliminado',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario no existe',
                errors: { message: 'El usuario no existe' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

});

// ============================================================================================
// Fin --> Borrar usuario
// ============================================================================================



module.exports = app;