// ==========================================
// Requires -> Importacion de librerias
// ==========================================

var express = require('express');
var path = require('path');
var fs = require('fs');

// ==========================================
// Inicializar variable
// ==========================================

var app = express();

// ==========================================
// Rutas
// ==========================================

app.get("/:tipo/:img", (req, res) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImagen = path.resolve(__dirname, `../uploads/${ tipo}/${ img }`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImagen = path.resolve(__dirname, `../assets/no-img.jpg`);
        res.sendFile(pathNoImagen);
    }
});

module.exports = app;