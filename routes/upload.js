// ==========================================
// Requires -> Importacion de librerias
// ==========================================

var express = require('express');
var fileUpload = require('express-fileupload');
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');
var fs = require('fs');

// ==========================================
// Inicializar variable
// ==========================================

var app = express();
app.use(fileUpload());

// ==========================================
// Rutas
// ==========================================

app.put("/:tipo/:id", (req, res) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de colecciones

    var tiposValidos = ['usuarios', 'hospitales', 'medicos'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no valida',
            error: { message: 'Tipo de coleccion no valida' }
        });

    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Error al cargar una imagen',
            error: { message: 'Debe de seleccionar una imagen' }
        });
    }

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Error en la extension cargada',
            error: { message: 'Las extenciones validas son ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado

    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    // Mover archivo del temporal a un path

    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

    });

});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    switch (tipo) {
        case 'usuarios':

            Usuario.findById(id, (err, usuario) => {

                if (!usuario) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Usuario no existe',
                        errors: { message: 'Usuario no existe' }
                    })
                }

                var pathViejo = './uploads/usuarios/' + usuario.img;

                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }

                usuario.img = nombreArchivo;
                usuario.save((err, usuarioActualizado) => {

                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de usuario actualizado',
                        usuario: usuarioActualizado
                    });

                });
            });
            break;
        case 'medicos':

            Medico.findById(id, (err, medico) => {

                if (!medico) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Medico no existe',
                        errors: { message: 'Medico no existe' }
                    })
                }


                var pathViejo = './uploads/medicos/' + medico.img;

                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo)
                }

                medico.img = nombreArchivo;
                medico.save((err, medicoActualizado) => {

                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de medico actualizado',
                        medico: medicoActualizado
                    });
                });

            });
            break;

        case 'hospitales':

            Hospital.findById(id, (err, hospital) => {

                if (!hospital) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Hospital no existe',
                        errors: { message: 'Hospital no existe' }
                    })
                }

                var pathViejo = './uploads/hospitales/' + hospital.img;

                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }

                hospital.img = nombreArchivo;
                hospital.save((err, hospitalActualizado) => {

                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de hospital actualizada',
                        hospital: hospitalActualizado
                    });
                });
            });
            break;
        default:
            res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: { message: 'Coleccion no valida' }
            });
            break;
    }
}

module.exports = app;