// ==========================================
// Requires -> Importacion de librerias
// ==========================================

var express = require('express');
var mongoose = require('mongoose');

// ==========================================
// Conexion a la base de datos
// ==========================================

mongoose.connection.openUri('mongodb://localhost:27017/wimmDB', (err, res) => {
    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online')
});

// ==========================================
// Inicializar variables
// ==========================================

var app = express();

// ==========================================
// Rutas
// ==========================================

app.get("/", (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    })
});

// ==========================================
// Escuchar peticiones
// ==========================================

app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});