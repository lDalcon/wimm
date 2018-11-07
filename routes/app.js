// ==========================================
// Requires -> Importacion de librerias
// ==========================================

var express = require('express');

// ==========================================
// Inicializar variable
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

module.exports = app;