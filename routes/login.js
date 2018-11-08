// ============================================================================================
// Requires -> Importacion de librerias
// ============================================================================================

var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;

// ============================================================================================
// Fin --> Requires -> Importacion de librerias
// ============================================================================================
// ============================================================================================
// Inicializar variable
// ============================================================================================

var app = express();
var Usuario = require('../models/usuario');
// ============================================================================================
// Fin --> Inicializar variable
// ============================================================================================

// ============================================================================================
// Inician Sesión
// ============================================================================================

app.post("/", (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error en credenciales - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error en credenciales - password',
                errors: err
            });
        }

        usuarioDB.password = "";
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 1200 });

        res.status(200).json({
            ok: true,
            token: token,
            usuario: usuarioDB,
            id: usuarioDB.id
        });
    });



});

// ============================================================================================
// Fin --> Inician Sesión
// ============================================================================================


module.exports = app;